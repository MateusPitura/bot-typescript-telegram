import { TelegramClient } from "telegram";
import { RelationalRepository } from "./repository/RelationalRepository";

type EntityProps = Record<"username", string>;
const ignoreGroups = process.env.IGNORE_GROUPS?.split(",") || [];

export async function listGroups(
  client: TelegramClient,
  relationalRepository: RelationalRepository,
) {
  const dialogs = await client.getDialogs({});

  for await (const dialog of dialogs) {
    const groupUserName = (dialog.entity as EntityProps)?.username;

    if (!groupUserName || ignoreGroups.includes(groupUserName)) continue;

    relationalRepository.createGroup({
      username: groupUserName,
      title: dialog.title!,
    });
  }
}
