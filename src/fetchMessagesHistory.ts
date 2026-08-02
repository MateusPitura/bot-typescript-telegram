import { TelegramClient } from "telegram";
import { RelationalRepository } from "./repository/RelationalRepository";
import { Group } from "./repository/entities";
import { parseDate } from "./utils/parseDate";

const stopDate = new Date("2025-08-02T00:00:00Z");

export async function fetchMessagesHistory(
  client: TelegramClient,
  relationalRepository: RelationalRepository,
  group: Group,
): Promise<number> {
  let maxId = group.last_message_id;

  for await (const message of client.iterMessages(group.user_name)) {
    const date = parseDate(message.date);

    if (date < stopDate) {
      break;
    }

    relationalRepository.insertMessage({
      telegram_message_id: message.id,
      group_user_name: group.user_name,
      timestamp: date.getTime(),
      text: message.message,
    });

    maxId = Math.max(maxId, message.id);
  }

  return maxId;
}
