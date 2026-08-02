import { TelegramClient } from "telegram";

type EntityProps = Record<"username", string>;

export async function listGroups(client: TelegramClient) {
  const dialogs = await client.getDialogs({});

  for (const dialog of dialogs) {
    const groupName = (dialog.entity as EntityProps)?.username
    if(!groupName) continue;
    console.log(groupName);
  }
}
