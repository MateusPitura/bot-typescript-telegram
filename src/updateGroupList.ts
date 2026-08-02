import { TelegramClient } from "telegram";
import { RelationalRepository } from "./repository/RelationalRepository";

type EntityProps = Record<"username", string>;
const ignoreGroups = process.env.IGNORE_GROUPS?.split(",") || [];

export async function updateGroupList(
  client: TelegramClient,
  relationalRepository: RelationalRepository,
) {
  const dialogs = await client.getDialogs({});

  for await (const dialog of dialogs) {
    const groupUserName = (dialog.entity as EntityProps)?.username;

    if (!groupUserName || ignoreGroups.includes(groupUserName)) continue;

    relationalRepository.createGroup({
      user_name: groupUserName,
      title: dialog.title!,
    });
  }
}
