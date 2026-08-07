import { fetchMessagesHistory } from "../src/fetchMessagesHistory";
import { TelegramRepository } from "../src/repository/TelegramRepository";
import { fetchNewMessages } from "./fetchNewMessages";
import { DatabaseInterface } from "./repository/DatabaseInterface";

export async function fetchMessages(
  databaseRepository: DatabaseInterface,
  telegramRepository: TelegramRepository,
) {
  const groups = await databaseRepository.listGroups();

  for await (const group of groups) {
    let maxId = 0;

    if (group.last_message_id > 0) {
      console.log(`Fetching new messages: ${group.title}`);

      maxId = await fetchNewMessages(
        telegramRepository,
        databaseRepository,
        group,
      );
    } else {
      console.log(`Fetching messages history: ${group.title}`);

      maxId = await fetchMessagesHistory(
        telegramRepository,
        databaseRepository,
        group,
      );
    }

    if (maxId > group.last_message_id) {
      databaseRepository.updateGroupLastMessageId({
        user_name: group.user_name,
        last_message_id: maxId,
      });
    }
  }
}
