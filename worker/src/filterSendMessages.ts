import { fetchMessages } from "./fetchMessages";
import { filterMessages } from "./filterMessages";
import { DatabaseRepository } from "./repository/DatabaseRepository";
import { TelegramRepository } from "./repository/TelegramRepository";
import { formatMessagesToSend } from "./utils/formatMessagesToSend";

export async function filterSendMessages(env: Env) {
  const databaseRepository = new DatabaseRepository().init(env.KV);
  const telegramRepository = await new TelegramRepository().init(env);

  console.log('Fetching messages...')
  await fetchMessages(databaseRepository, telegramRepository);

  console.log('Getting group description...')
  const keyword = await telegramRepository.getGroupDescription(env.BOT_TOKEN);
  console.log("keyword: ", keyword);
  if (!keyword) return;

  const filteredMessages = await filterMessages(databaseRepository, keyword);
  const formattedMessages = formatMessagesToSend(filteredMessages);
  console.log('Sending message...')
  if (formattedMessages.length) {
    await telegramRepository.sendMessage(
      env.BOT_TOKEN,
      env.CHAT_ID,
      formattedMessages,
    );
  } else {
    await telegramRepository.sendMessage(env.BOT_TOKEN, env.CHAT_ID, [
      'Nothing found for keyword: "' + keyword + '"',
    ]);
  }
}
