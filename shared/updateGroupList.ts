import { DatabaseRepository } from "../src/repository/DatabaseRepository";
import { TelegramRepository } from "../src/repository/TelegramRepository";

const ignoreGroups = process.env.IGNORE_GROUPS?.split(",") || [];

export async function updateGroupList(databaseRepository: DatabaseRepository) {
  const telegramRepository = await new TelegramRepository().init();

  const groups = await telegramRepository.listGroups();

  for await (const group of groups) {
    const groupUserName = group.entity?.username;

    if (!groupUserName || ignoreGroups.includes(groupUserName)) continue;

    databaseRepository.createGroup({
      user_name: groupUserName,
      title: group.title!,
    });
  }

  telegramRepository.disconnect();
}
