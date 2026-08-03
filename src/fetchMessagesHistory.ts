import { DatabaseGroup } from "../worker/src/types/databaseDtos";
import { DatabaseRepository } from "./repository/DatabaseRepository";
import { TelegramRepository } from "./repository/TelegramRepository";
import { parseDate } from "./utils/parseDate";

const stopDate = new Date("2025-08-02T00:00:00Z");

export async function fetchMessagesHistory(
  telegramRepository: TelegramRepository,
  databaseRepository: DatabaseRepository,
  group: DatabaseGroup,
): Promise<number> {
  let maxId = group.last_message_id;

  for await (const message of telegramRepository.iterateMessages(
    group.user_name,
  )) {
    const date = parseDate(message.date);

    if (date < stopDate) {
      break;
    }

    databaseRepository.insertMessage({
      telegram_message_id: message.id,
      group_user_name: group.user_name,
      timestamp: date.getTime(),
      text: message.message,
    });

    maxId = Math.max(maxId, message.id);
  }

  return maxId;
}
