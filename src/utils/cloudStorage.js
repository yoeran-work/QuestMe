import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase";

const USERS_COLLECTION = "users";
const CLOUD_SAVE_VERSION = 4;

function normalizeCloudData(data = {}) {
  return {
    version: CLOUD_SAVE_VERSION,

    meta: {
      starterQuestsSeeded:
        data.meta?.starterQuestsSeeded ?? true
    },

    profile: {
      characterName:
        data.profile?.characterName || "",

      totalXp:
        Number.isFinite(data.profile?.totalXp)
          ? data.profile.totalXp
          : 0,

      yBucks:
        Number.isFinite(data.profile?.yBucks)
          ? data.profile.yBucks
          : 0
    },

    quests: Array.isArray(data.quests)
      ? data.quests
      : [],

    questCompletions:
      Array.isArray(data.questCompletions)
        ? data.questCompletions
        : [],

    rewards: Array.isArray(data.rewards)
      ? data.rewards
      : [],

    inventory: Array.isArray(data.inventory)
      ? data.inventory
      : [],

    purchases: Array.isArray(data.purchases)
      ? data.purchases
      : [],

    consumptions:
      Array.isArray(data.consumptions)
        ? data.consumptions
        : [],

    sales: Array.isArray(data.sales)
      ? data.sales
      : [],

    specials: Array.isArray(data.specials)
      ? data.specials
      : [],

    lootEvents: Array.isArray(data.lootEvents)
      ? data.lootEvents
      : [],

    lootState: {
      pity:
        Number.isFinite(data.lootState?.pity)
          ? data.lootState.pity
          : 0
    },

    // Tijdelijk behouden zodat oude v3-clouddata
    // niet verloren gaat tijdens de migratie.
    consumedRewards:
      Array.isArray(data.consumedRewards)
        ? data.consumedRewards
        : []
  };
}

export async function getCloudSave(uid) {
  if (!uid) {
    throw new Error(
      "QuestMe: cannot load cloud save without a user ID."
    );
  }

  const userRef = doc(
    db,
    USERS_COLLECTION,
    uid
  );

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeCloudData(
    snapshot.data()
  );
}

export async function saveCloudData(
  uid,
  appData
) {
  if (!uid) {
    throw new Error(
      "QuestMe: cannot save cloud data without a user ID."
    );
  }

  const userRef = doc(
    db,
    USERS_COLLECTION,
    uid
  );

  const normalizedData =
    normalizeCloudData(appData);

  const cloudData = {
    ...normalizedData,

    updatedAt: serverTimestamp()
  };

  await setDoc(
    userRef,
    cloudData
  );
}

export async function cloudSaveExists(uid) {
  if (!uid) {
    return false;
  }

  const userRef = doc(
    db,
    USERS_COLLECTION,
    uid
  );

  const snapshot = await getDoc(userRef);

  return snapshot.exists();
}
