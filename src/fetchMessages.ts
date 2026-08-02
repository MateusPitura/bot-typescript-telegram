import { TelegramClient } from "telegram";
import { fetchMessagesHistory } from "./fetchMessagesHistory";
import { fetchNewMessages } from "./fetchNewMessages";
import { RelationalRepository } from "./repository/RelationalRepository";

export async function fetchMessages(
  client: TelegramClient,
  relationalRepository: RelationalRepository,
) {
  const groups = relationalRepository.listGroups();

  for await (const group of groups) {
    let maxId = 0;

    if (group.last_message_id > 0) {
      console.log(`Fetching new messages: ${group.title}`);

      maxId = await fetchNewMessages(client, relationalRepository, group);
    } else {
      console.log(`Fetching messages history: ${group.title}`);

      maxId = await fetchMessagesHistory(client, relationalRepository, group);
    }

    if (maxId > group.last_message_id) {
      relationalRepository.updateGroupLastMessageId({
        user_name: group.user_name,
        last_message_id: maxId,
      });
    }
  }
}
