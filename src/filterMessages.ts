import { TelegramClient } from "telegram";

const group = "escolhasegura";
const keywords = ["samsung"];

export async function filterMessages(client: TelegramClient) {
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
}
