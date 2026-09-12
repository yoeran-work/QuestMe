import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase";

const USERS_COLLECTION = "users";

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

  const data = snapshot.data();

  return {
    version: data.version ?? 3,

    meta: data.meta ?? {
      starterQuestsSeeded: true
    },

    profile: data.profile ?? {
      characterName: "",
      totalXp: 0,
      yBucks: 0
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

    purchases: Array.isArray(data.purchases)
      ? data.purchases
      : [],

    consumedRewards:
      Array.isArray(data.consumedRewards)
        ? data.consumedRewards
        : []
  };
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

  const cloudData = {
    version: appData.version ?? 3,

    meta: {
      ...(appData.meta || {})
    },

    profile: {
      ...(appData.profile || {})
    },

    quests: Array.isArray(appData.quests)
      ? appData.quests
      : [],

    questCompletions:
      Array.isArray(appData.questCompletions)
        ? appData.questCompletions
        : [],

    rewards: Array.isArray(appData.rewards)
      ? appData.rewards
      : [],

    purchases: Array.isArray(appData.purchases)
      ? appData.purchases
      : [],

    consumedRewards:
      Array.isArray(appData.consumedRewards)
        ? appData.consumedRewards
        : [],

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
