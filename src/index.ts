import "dotenv/config";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import fs from "node:fs";
import { ask } from "./ask";

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH!;
const phoneNumber = process.env.CELL_PHONE!;
const SESSION_FILE = "session.txt";

const group = "escolhasegura";
const keywords = ["samsung"];

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

  const messages = await client.getMessages(group, {
    limit: 100,
  });

  console.log(`Loaded ${messages.length} messages\n`);

  for (const msg of messages.reverse()) {
    if (!msg.message) continue;

    const text = msg.message.toLowerCase();

    const match = keywords.some((keyword) => text.includes(keyword));

    if (!match) continue;

    console.log("--------------------------------");
    console.log(msg.date);
    console.log(msg.message);
  }

  void client.disconnect();
  process.exit(0);
}

main().catch(console.error);
