import { DatabaseRepository } from "./repository/DatabaseRepository";
import { TelegramRepository } from "./repository/TelegramRepository";
import { DatabaseGroup } from "./types/databaseDtos";
import { parseDate } from "./utils/parseDate";

export async function fetchNewMessages(
  telegramRepository: TelegramRepository,
  databaseRepository: DatabaseRepository,
  group: DatabaseGroup,
): Promise<number> {
  let maxId = group.last_message_id;

  for await (const message of telegramRepository.iterateMessages(
    group.user_name,
    group.last_message_id,
  )) {
    const date = parseDate(message.date);

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
