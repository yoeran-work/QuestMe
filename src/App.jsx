import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  getXpProgress
} from "./utils/leveling";

import {
  loadAppData,
  saveAppData
} from "./utils/storage";

import {
  getCloudSave,
  saveCloudData
} from "./utils/cloudStorage";

import {
  areSavesEquivalent,
  hasMeaningfulLocalProgress
} from "./utils/syncConflict";

import {
  getCompletionPeriodKey,
  isQuestCompleted,
  normalizeQuestType
} from "./utils/questSchedule";

import {
  consumeInventoryItem,
  sellInventoryStack
} from "./utils/inventoryActions";

import {
  purchaseReward
} from "./utils/purchaseReward";

import {
  archiveReward,
  restoreReward
} from "./utils/rewardInventory";

import {
  getRarityLabel,
  tryQuestLootDrop
} from "./utils/lootEngine";

import {
  useAuth
} from "./hooks/useAuth";

import starterQuests
  from "./data/starterQuests";

import QuestList
  from "./components/QuestList";

import QuestForm
  from "./components/QuestForm";

import CharacterCard
  from "./components/CharacterCard";

import Wallet
  from "./components/Wallet";

import AuthPanel
  from "./components/AuthPanel";

import CharacterSetup
  from "./components/CharacterSetup";

import CharacterSheet
  from "./components/CharacterSheet";

import CloudStatus
  from "./components/CloudStatus";

import CloudConflictDialog
  from "./components/CloudConflictDialog";

import Store
 from "./pages/Store";

import Inventory
 from "./pages/Inventory";

import Stats
  from "./pages/Stats";

import "./quest-management.css";
import "./store.css";
import "./inventory.css";
import "./stats.css";

function App() {
  const [appData, setAppData] =
    useState(() => {
      const savedData =
        loadAppData();

      if (
        !savedData.meta
          .starterQuestsSeeded
      ) {
        return {
          ...savedData,

          meta: {
            ...savedData.meta,
            starterQuestsSeeded: true
          },

          quests: starterQuests
        };
      }

      return savedData;
    });

  const [ 
    activePage,
    setActivePage
  ] = useState("quests")
  
  const [
    toast,
    setToast
  ] = useState(null);

  const toastTimer =
    useRef(null);

  const [
    editingQuest,
    setEditingQuest
  ] = useState(null);

  const [
    questFormOpen,
    setQuestFormOpen
  ] = useState(false);

  const [
    characterSheetOpen,
    setCharacterSheetOpen
  ] = useState(false);

  const [
    cloudState,
    setCloudState
  ] = useState("idle");

  const [
    cloudInitialized,
    setCloudInitialized
  ] = useState(false);

  const [
    pendingCloudData,
    setPendingCloudData
  ] = useState(null);

  const [
    resolvingConflict,
    setResolvingConflict
  ] = useState(false);

  const cloudSaveTimer =
    useRef(null);

  const {
    user,
    authLoading,
    authError,
    signInWithGoogle,
    signOutUser
  } = useAuth();

  const {
    profile,
    quests,
    questCompletions
  } = appData;

  const characterName =
    profile.characterName || "";

  const xp =
    profile.totalXp;

  const yBucks =
    profile.yBucks;

  const progress =
    getXpProgress(xp);

  const now =
    new Date();

  const completedQuestIds =
    quests
      .filter((quest) =>
        isQuestCompleted(
          quest,
          questCompletions,
          now
        )
      )
      .map(
        (quest) => quest.id
      );

  useEffect(() => {
    saveAppData(appData);
  }, [appData]);

  useEffect(() => {
    if (!user) {
      setCloudInitialized(false);
      setPendingCloudData(null);
      setCloudState("idle");

      return;
    }

    let cancelled = false;

    async function initializeCloud() {
      try {
        setCloudInitialized(false);
        setPendingCloudData(null);
        setCloudState("checking");

        const cloudData =
          await getCloudSave(
            user.uid
          );

        if (cancelled) {
          return;
        }

        if (!cloudData) {
          setCloudState(
            "uploading"
          );

          await saveCloudData(
            user.uid,
            appData
          );

          if (cancelled) {
            return;
          }

          setCloudInitialized(
            true
          );

          setCloudState(
            "synced"
          );

          return;
        }

        if (
          areSavesEquivalent(
            appData,
            cloudData
          )
        ) {
          setCloudInitialized(
            true
          );

          setCloudState(
            "synced"
          );

          return;
        }

        if (
          !hasMeaningfulLocalProgress(
            appData
          )
        ) {
          setCloudState(
            "downloading"
          );

          setAppData(
            cloudData
          );

          setEditingQuest(
            null
          );

          setCloudInitialized(
            true
          );

          setCloudState(
            "synced"
          );

          return;
        }

        setPendingCloudData(
          cloudData
        );

        setCloudState(
          "conflict"
        );
      } catch (error) {
        console.error(
          "QuestMe: cloud initialization failed.",
          error
        );

        if (!cancelled) {
          setCloudState(
            "error"
          );
        }
      }
    }

    initializeCloud();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (
      !user ||
      !cloudInitialized ||
      pendingCloudData
    ) {
      return;
    }

    if (
      cloudSaveTimer.current
    ) {
      clearTimeout(
        cloudSaveTimer.current
      );
    }

    cloudSaveTimer.current =
      setTimeout(
        async () => {
          try {
            setCloudState(
              "saving"
            );

            await saveCloudData(
              user.uid,
              appData
            );

            setCloudState(
              "synced"
            );
          } catch (error) {
            console.error(
              "QuestMe: cloud save failed.",
              error
            );

            setCloudState(
              "error"
            );
          }
        },
        600
      );

    return () => {
      if (
        cloudSaveTimer.current
      ) {
        clearTimeout(
          cloudSaveTimer.current
        );
      }
    };
  }, [
    appData,
    user,
    cloudInitialized,
    pendingCloudData
  ]);

  function showToast(
    message,
    type = "success"
  ) {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToast({
      id: Date.now(),
      message,
      type
    });

    toastTimer.current =
      setTimeout(() => {
        setToast(null);
      }, 3200);
  }

  async function useCloudSave() {
    if (
      !pendingCloudData
    ) {
      return;
    }

    setResolvingConflict(
      true
    );

    try {
      setCloudState(
        "downloading"
      );

      setAppData(
        pendingCloudData
      );

      setEditingQuest(
        null
      );

      setPendingCloudData(
        null
      );

      setCloudInitialized(
        true
      );

      setCloudState(
        "synced"
      );
    } finally {
      setResolvingConflict(
        false
      );
    }
  }

  async function keepLocalSave() {
    if (
      !user ||
      !pendingCloudData
    ) {
      return;
    }

    setResolvingConflict(
      true
    );

    try {
      setCloudState(
        "uploading"
      );

      await saveCloudData(
        user.uid,
        appData
      );

      setPendingCloudData(
        null
      );

      setCloudInitialized(
        true
      );

      setCloudState(
        "synced"
      );
    } catch (error) {
      console.error(
        "QuestMe: failed to replace cloud save.",
        error
      );

      setCloudState(
        "error"
      );
    } finally {
      setResolvingConflict(
        false
      );
    }
  }

  function saveCharacterName(
    name
  ) {
    setAppData(
      (currentData) => ({
        ...currentData,

        profile: {
          ...currentData.profile,
          characterName: name
        }
      })
    );
  }

  async function handleSignOut() {
    setCharacterSheetOpen(
      false
    );

    await signOutUser();
  }

  function completeQuest(
    quest
  ) {
    const completedAt =
      new Date();

    let feedback = null;

    setAppData(
      (currentData) => {
        const alreadyCompleted =
          isQuestCompleted(
            quest,
            currentData.questCompletions,
            completedAt
          );

        if (alreadyCompleted) {
          return currentData;
        }

        const questType =
          normalizeQuestType(
            quest.type
          );

        const completion = {
          id: crypto.randomUUID(),
          questId: quest.id,
          questTitle: quest.title,
          questType,
          completedAt:
            completedAt.toISOString(),
          completedDate:
            `${completedAt.getFullYear()}-${String(
              completedAt.getMonth() + 1
            ).padStart(2, "0")}-${String(
              completedAt.getDate()
            ).padStart(2, "0")}`,
          periodKey:
            getCompletionPeriodKey(
              questType,
              completedAt
            ),
          xpEarned: quest.xp,
          yEarned: quest.y
        };

        const loot =
          tryQuestLootDrop({
            quest,
            rewards:
              currentData.rewards,
            lootState:
              currentData.lootState
          });

        feedback =
          loot.dropped
            ? `✨ ${getRarityLabel(loot.rarity)} DROP! ${loot.reward.icon || "🎁"} ${loot.reward.name}`
            : `⚔️ Quest complete! +${quest.xp} XP · +${quest.y} Y`;

        return {
          ...currentData,

          profile: {
            ...currentData.profile,
            totalXp:
              currentData.profile.totalXp +
              quest.xp,
            yBucks:
              currentData.profile.yBucks +
              quest.y
          },

          questCompletions: [
            ...currentData.questCompletions,
            completion
          ],

          inventory:
            loot.dropped
              ? [
                  ...currentData.inventory,
                  loot.acquisition
                ]
              : currentData.inventory,

          lootEvents:
            loot.dropped
              ? [
                  ...currentData.lootEvents,
                  loot.lootEvent
                ]
              : currentData.lootEvents,

          lootState:
            loot.lootState
        };
      }
    );

    window.setTimeout(() => {
      showToast(
        feedback ||
          `⚔️ Quest complete! +${quest.xp} XP · +${quest.y} Y`
      );
    }, 0);
  }

  function addQuest(
    newQuest
  ) {
    setAppData(
      (currentData) => ({
        ...currentData,

        quests: [
          ...currentData.quests,
          newQuest
        ]
      })
    );

    setQuestFormOpen(false);
    showToast("⚔️ Nieuwe quest toegevoegd!");
  }
function archiveStoreReward(
  rewardId
) {
  setAppData((currentData) => ({
    ...currentData,
    rewards: currentData.rewards.map(
      (reward) =>
        reward.id === rewardId
          ? archiveReward(reward)
          : reward
    )
  }));

  showToast("📚 Reward gearchiveerd.");
}

function restoreStoreReward(
  rewardId
) {
  setAppData((currentData) => ({
    ...currentData,
    rewards: currentData.rewards.map(
      (reward) =>
        reward.id === rewardId
          ? restoreReward(reward)
          : reward
    )
  }));

  showToast("✨ Reward teruggezet in de Store.");
}

function addReward(
  newReward
) {
  setAppData(
    (currentData) => ({
      ...currentData,

      rewards: [
        ...currentData.rewards,
        newReward
      ]
    })
  );
}
function buyReward(
  rewardId
) {
  const reward =
    appData.rewards.find(
      (item) => item.id === rewardId
    );

  const result =
    purchaseReward(
      appData,
      rewardId
    );

  if (!result.success) {
    if (result.reason === "not-enough-y") {
      showToast(
        `⚔️ Nog niet genoeg Y-bucks! Je komt nog ${result.missingY} Y tekort.`,
        "warning"
      );
    } else {
      showToast(
        "Deze reward is nu niet beschikbaar.",
        "warning"
      );
    }

    return;
  }

  setAppData(result.data);

  showToast(
    `🛒 ${reward?.name || "Reward"} gekocht voor ${result.purchase.totalPrice} Y!`
  );
}
function consumeReward(
  acquisitionId
) {
  setAppData(
    (currentData) => {
      const result =
        consumeInventoryItem(
          currentData.inventory,
          acquisitionId
        );

      if (!result.success) {
        return currentData;
      }

      return {
        ...currentData,

        inventory:
          result.inventory,

        consumptions: [
          ...currentData.consumptions,
          result.consumption
        ]
      };
    }
  );
}
  function sellReward(
    itemId,
    quantity = 1
  ) {
    const result =
      sellInventoryStack(
        appData.inventory,
        itemId,
        quantity,
        1
      );

    if (!result.success) {
      showToast(
        "Deze reward kan niet verkocht worden.",
        "warning"
      );
      return;
    }

    setAppData(
      (currentData) => ({
        ...currentData,

        profile: {
          ...currentData.profile,
          yBucks:
            currentData.profile.yBucks +
            result.refund
        },

        inventory:
          result.inventory,

        sales: [
          ...currentData.sales,
          ...result.sales
        ]
      })
    );

    const item =
      appData.inventory.find(
        (entry) =>
          entry.itemId === itemId
      );

    showToast(
      `🪙 ${quantity}× ${item?.itemName || "reward"} verkocht voor ${result.refund} Y!`
    );
  }

  function editQuest(
    quest
  ) {
    setEditingQuest(
      quest
    );

    setQuestFormOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function saveEditedQuest(
    updatedQuest
  ) {
    setAppData(
      (currentData) => ({
        ...currentData,

        quests:
          currentData
            .quests
            .map(
              (quest) =>
                quest.id ===
                updatedQuest.id
                  ? updatedQuest
                  : quest
            )
      })
    );

    setEditingQuest(
      null
    );

    setQuestFormOpen(false);
  }

  function cancelEdit() {
    setEditingQuest(
      null
    );

    setQuestFormOpen(false);
  }

  function deleteQuest(
    quest
  ) {
    const shouldDelete =
      window.confirm(
        `Weet je zeker dat je "${quest.title}" wilt verwijderen?`
      );

    if (
      !shouldDelete
    ) {
      return;
    }

    setAppData(
      (currentData) => ({
        ...currentData,

        quests:
          currentData
            .quests
            .filter(
              (
                currentQuest
              ) =>
                currentQuest.id !==
                quest.id
            )
      })
    );

    if (
      editingQuest?.id ===
      quest.id
    ) {
      setEditingQuest(
        null
      );
    }
  }

  return (
    <div className="app">
      {!characterName &&
        !pendingCloudData && (
          <CharacterSetup
            currentName={
              characterName
            }
            onSave={
              saveCharacterName
            }
          />
        )}

      {pendingCloudData && (
        <CloudConflictDialog
          localData={
            appData
          }
          cloudData={
            pendingCloudData
          }
          resolving={
            resolvingConflict
          }
          onUseCloud={
            useCloudSave
          }
          onKeepLocal={
            keepLocalSave
          }
        />
      )}

      <CharacterSheet
        open={
          characterSheetOpen
        }
        onClose={() =>
          setCharacterSheetOpen(
            false
          )
        }
        characterName={
          characterName
        }
        progress={
          progress
        }
        xp={
          xp
        }
        yBucks={
          yBucks
        }
        quests={
          quests
        }
        questCompletions={
          questCompletions
        }
        user={
          user
        }
        cloudState={
          cloudState
        }
        onRename={
          saveCharacterName
        }
        onSignOut={
          handleSignOut
        }
      />

      <header className="topbar">
        <div>
          <h1>
            ⚔️ QuestMe
          </h1>

          <p>
            Turn real life into an RPG.
          </p>
        </div>

        <div className="topbar-actions">
          <Wallet
            yBucks={
              yBucks
            }
          />

          <CloudStatus
            user={
              user
            }
            cloudState={
              cloudState
            }
          />

          <AuthPanel
            user={
              user
            }
            characterName={
              characterName
            }
            authLoading={
              authLoading
            }
            authError={
              authError
            }
            onSignIn={
              signInWithGoogle
            }
            onOpenCharacter={() =>
              setCharacterSheetOpen(
                true
              )
            }
          />
        </div>
      </header>
                  <nav
        className="main-navigation"
        aria-label="Main navigation"
      >
        <button
          type="button"
          className={activePage === "quests" ? "active" : ""}
          onClick={() => setActivePage("quests")}
          aria-label="Quests"
          title="Quests"
        >
          <span aria-hidden="true">⚔️</span>
        </button>

        <button
          type="button"
          className={activePage === "store" ? "active" : ""}
          onClick={() => setActivePage("store")}
          aria-label="Store"
          title="Store"
        >
          <span aria-hidden="true">🛒</span>
        </button>

        <button
          type="button"
          className={activePage === "inventory" ? "active" : ""}
          onClick={() => setActivePage("inventory")}
          aria-label="Inventory"
          title="Inventory"
        >
          <span aria-hidden="true">🎒</span>
        </button>

        <button
          type="button"
          className={activePage === "stats" ? "active" : ""}
          onClick={() => setActivePage("stats")}
          aria-label="Stats"
          title="Stats"
        >
          <span aria-hidden="true">📊</span>
        </button>
      </nav>

      {toast && (
        <div
          className={`quest-toast ${toast.type}`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}

      <main>
        {activePage === "quests" && (
          <>
        <CharacterCard
          progress={
            progress
          }
          xp={
            xp
          }
          characterName={
            characterName
          }
        />

        <section className="section">
          <div className="section-heading quest-section-heading">
            <div>
              <h2>
                ⚔️ Quests
              </h2>

              <span>
                {completedQuestIds.length}/
                {quests.length}{" "}
                available period completed
              </span>
            </div>

            <button
              type="button"
              className="quest-add-button"
              onClick={() => {
                setEditingQuest(null);
                setQuestFormOpen(true);
              }}
              aria-label="Nieuwe quest"
              title="Nieuwe quest"
            >
              +
            </button>
          </div>

          {questFormOpen && (
            <div
              className="quest-form-backdrop"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  cancelEdit();
                }
              }}
            >
              <div className="quest-form-modal">
                <QuestForm
                  onAddQuest={addQuest}
                  editingQuest={editingQuest}
                  onSaveEdit={saveEditedQuest}
                  onCancelEdit={cancelEdit}
                />
              </div>
            </div>
          )}

          <QuestList
            quests={
              quests
            }
            completedQuests={
              completedQuestIds
            }
            onComplete={
              completeQuest
            }
            onEdit={
              editQuest
            }
            onDelete={
              deleteQuest
            }
          />
        </section>
       </> )}
       
        {activePage === "store" && (
          <Store
            rewards={appData.rewards}
            yBucks={yBucks}
            onAddReward={addReward}
            onBuyReward={buyReward}
            onArchiveReward={archiveStoreReward}
            onRestoreReward={restoreStoreReward}
            specials={appData.specials}
        />
        )}
        {activePage === "inventory" && (
          <Inventory
            inventory={appData.inventory}
            rewards={appData.rewards}
            onConsume={consumeReward}
            onSell={sellReward}
          />
        )}

        {activePage === "stats" && (
          <Stats appData={appData} />
        )}
      </main>
    </div>
  );
}

export default App;
