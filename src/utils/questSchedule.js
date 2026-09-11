export const QUEST_TYPES = {
  DAILY: "daily",
  WEEKLY: "weekly",
  ONE_TIME: "one-time"
};

export function normalizeQuestType(type) {
  if (
    type === QUEST_TYPES.WEEKLY ||
    type === QUEST_TYPES.ONE_TIME
  ) {
    return type;
  }

  return QUEST_TYPES.DAILY;
}

export function formatQuestType(type) {
  const normalizedType = normalizeQuestType(type);

  switch (normalizedType) {
    case QUEST_TYPES.WEEKLY:
      return "📅 Weekly";

    case QUEST_TYPES.ONE_TIME:
      return "🏆 One-time";

    default:
      return "☀️ Daily";
  }
}

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMondayOfWeek(date) {
  const monday = new Date(date);

  monday.setHours(12, 0, 0, 0);

  const day = monday.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  monday.setDate(monday.getDate() + difference);

  return monday;
}

export function getCompletionPeriodKey(type, date = new Date()) {
  const normalizedType = normalizeQuestType(type);

  if (normalizedType === QUEST_TYPES.ONE_TIME) {
    return "once";
  }

  if (normalizedType === QUEST_TYPES.WEEKLY) {
    const monday = getMondayOfWeek(date);

    return `week:${getLocalDateKey(monday)}`;
  }

  return `day:${getLocalDateKey(date)}`;
}

function getCompletionDate(completion) {
  if (completion.completedAt) {
    const date = new Date(completion.completedAt);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  if (completion.completedDate) {
    const date = new Date(`${completion.completedDate}T12:00:00`);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}

export function isQuestCompleted(
  quest,
  questCompletions,
  date = new Date()
) {
  const matchingCompletions = questCompletions.filter(
    (completion) => completion.questId === quest.id
  );

  if (matchingCompletions.length === 0) {
    return false;
  }

  const questType = normalizeQuestType(quest.type);

  if (questType === QUEST_TYPES.ONE_TIME) {
    return true;
  }

  const currentPeriodKey = getCompletionPeriodKey(
    questType,
    date
  );

  return matchingCompletions.some((completion) => {
    if (completion.periodKey) {
      return completion.periodKey === currentPeriodKey;
    }

    const completionDate = getCompletionDate(completion);

    if (!completionDate) {
      return false;
    }

    return (
      getCompletionPeriodKey(
        questType,
        completionDate
      ) === currentPeriodKey
    );
  });
}
