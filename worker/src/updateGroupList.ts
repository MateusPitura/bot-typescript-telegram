import { DatabaseInterface } from "./repository/DatabaseInterface";
import { TelegramRepository } from "./repository/TelegramRepository";

export async function updateGroupList(
  databaseRepository: DatabaseInterface,
  telegramRepository: TelegramRepository,
  ignoreGroups: string[],
) {
  const groups = await telegramRepository.listGroups();

  for await (const group of groups) {
    const groupUserName = group.entity.username;

    if (!groupUserName || ignoreGroups.includes(groupUserName)) continue;

    await databaseRepository.createGroup({
      user_name: groupUserName,
      title: group.title!,
    });
  }
}
