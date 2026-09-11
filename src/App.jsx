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
  getCompletionPeriodKey,
  isQuestCompleted,
  normalizeQuestType
} from "./utils/questSchedule";

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

import CloudStatus
  from "./components/CloudStatus";

import "./quest-management.css";

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
    editingQuest,
    setEditingQuest
  ] = useState(null);

  const [
    cloudState,
    setCloudState
  ] = useState("idle");

  const [
    cloudInitialized,
    setCloudInitialized
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
      setCloudState("idle");
      return;
    }

    let cancelled = false;

    async function initializeCloud() {
      try {
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
      !cloudInitialized
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
    cloudInitialized
  ]);

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

  function completeQuest(
    quest
  ) {
    const completedAt =
      new Date();

    setAppData(
      (currentData) => {
        const alreadyCompleted =
          isQuestCompleted(
            quest,
            currentData
              .questCompletions,
            completedAt
          );

        if (
          alreadyCompleted
        ) {
          return currentData;
        }

        const questType =
          normalizeQuestType(
            quest.type
          );

        const completion = {
          id:
            crypto.randomUUID(),

          questId:
            quest.id,

          questTitle:
            quest.title,

          questType,

          completedAt:
            completedAt
              .toISOString(),

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

          xpEarned:
            quest.xp,

          yEarned:
            quest.y
        };

        return {
          ...currentData,

          profile: {
            ...currentData.profile,

            totalXp:
              currentData.profile
                .totalXp +
              quest.xp,

            yBucks:
              currentData.profile
                .yBucks +
              quest.y
          },

          questCompletions: [
            ...currentData
              .questCompletions,

            completion
          ]
        };
      }
    );
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
  }

  function editQuest(
    quest
  ) {
    setEditingQuest(
      quest
    );

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
  }

  function cancelEdit() {
    setEditingQuest(
      null
    );
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
      {!characterName && (
        <CharacterSetup
          currentName={
            characterName
          }
          onSave={
            saveCharacterName
          }
        />
      )}

      <header className="topbar">
        <div>
          <h1>
            ⚔️ QuestMe
          </h1>

          <p>
            Turn real life
            into an RPG.
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
            onSignOut={
              signOutUser
            }
          />
        </div>
      </header>

      <main>
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
          <div className="section-heading">
            <h2>
              ⚔️ Quests
            </h2>

            <span>
              {
                completedQuestIds
                  .length
              }
              /
              {
                quests.length
              }{" "}
              available period
              completed
            </span>
          </div>

          <QuestForm
            onAddQuest={
              addQuest
            }
            editingQuest={
              editingQuest
            }
            onSaveEdit={
              saveEditedQuest
            }
            onCancelEdit={
              cancelEdit
            }
          />

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

        <section className="coming-soon">
          <div>
            <h2>
              🛒 Store
            </h2>

            <p>
              Coming soon...
            </p>
          </div>

          <div>
            <h2>
              🎒 Inventory
            </h2>

            <p>
              Coming soon...
            </p>
          </div>

          <div>
            <h2>
              📊 Statistics
            </h2>

            <p>
              Coming soon...
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
