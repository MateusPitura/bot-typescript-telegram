import "dotenv/config";
import fs from "node:fs";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { ask } from "./utils/ask";
import { filterMessages } from "./filterMessages";
import { listGroups } from "./listGroups";

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH!;
const phoneNumber = process.env.CELL_PHONE!;
const SESSION_FILE = "session.txt";

const sessionString = fs.existsSync(SESSION_FILE)
  ? fs.readFileSync(SESSION_FILE, "utf8")
  : "";

const stringSession = new StringSession(sessionString);

async function main() {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber,
    phoneCode: async () => ask("Telegram Code: "),
    password: async () => ask("2FA Password (if enabled): "),
    onError: console.error,
  });

  if (!fs.existsSync(SESSION_FILE)) {
    fs.writeFileSync(SESSION_FILE, client.session.save() as unknown as string);

    console.log("Session saved.");
  }

  switch (process.argv[2]) {
    case "list-groups":
      await listGroups(client);
      break;
    case "filter-messages":
      await filterMessages(client);
      break;
    default:
      console.log("Invalid command. Use 'list-groups' or 'filter-messages'.");
  }

  void client.disconnect();
  process.exit(0);
}

main().catch(console.error);
