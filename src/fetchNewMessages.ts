import { TelegramClient } from "telegram";
import { RelationalRepository } from "./repository/RelationalRepository";
import { Group } from "./repository/entities";
import { parseDate } from "./utils/parseDate";

export async function fetchNewMessages(
  client: TelegramClient,
  relationalRepository: RelationalRepository,
  group: Group,
): Promise<number> {
  let maxId = group.last_message_id;

  for await (const message of client.iterMessages(group.user_name, {
    minId: group.last_message_id,
  })) {
    const date = parseDate(message.date);

    relationalRepository.insertMessage({
      telegram_message_id: message.id,
      group_user_name: group.user_name,
      date: date.toISOString(),
      text: message.message,
    });

    maxId = Math.max(maxId, message.id);
  }

  return maxId;
}
