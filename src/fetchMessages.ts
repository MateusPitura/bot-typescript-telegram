import { fetchMessagesHistory } from "./fetchMessagesHistory";
import { fetchNewMessages } from "./fetchNewMessages";
import { DatabaseRepository } from "./repository/DatabaseRepository";
import { TelegramRepository } from "./repository/TelegramRepository";

export async function fetchMessages(
  databaseRepository: DatabaseRepository,
  telegramRepository: TelegramRepository,
) {
  const groups = databaseRepository.listGroups();

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
