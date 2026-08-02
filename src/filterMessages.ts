import { format } from "date-fns";
import { RelationalRepository } from "./repository/RelationalRepository";
import { writeFileSync } from "node:fs";

interface FilteredMessage {
  timestamp: number;
  text: string;
}

interface FormattedMessage {
  date: string;
  text: string;
}

const keyword = "samsung_OR_iphone_AND_apple";

export async function filterMessages(
  relationalRepository: RelationalRepository,
) {
  const messages = relationalRepository.listMessages();

  console.log(`Loaded ${messages.length} messages\n`);

  const keywordGroupFilteredMessagesMap: Map<string, FilteredMessage[]> =
    new Map();
  for (const message of messages) {
    const text = message.text?.toLowerCase() || "";

    for (const keywordGroup of keyword.split("_OR_")) {
      const containsAllKeywords = keywordGroup
        .split("_AND_")
        .every((keyword) => text.includes(keyword));

      if (!containsAllKeywords) continue;

      const date = new Date(message.date);
      const keywordGroupFilteredMessages =
        keywordGroupFilteredMessagesMap.get(keywordGroup);
      const filteredMessage = {
        timestamp: date.getTime(),
        text: message.text ?? "",
      };

      if (keywordGroupFilteredMessages) {
        keywordGroupFilteredMessages.push(filteredMessage);
        continue;
      }
      keywordGroupFilteredMessagesMap.set(keywordGroup, [filteredMessage]);
    }
  }

  const today = format(new Date(), "yyyy-MM-dd");
  const dir = `search/${today}`;
  if (!require("fs").existsSync(dir)) {
    require("fs").mkdirSync(dir, { recursive: true });
  }

  for (const [
    keywordGroup,
    filteredMessages,
  ] of keywordGroupFilteredMessagesMap) {
    const sortedMessages = filteredMessages.sort(
      (a, b) => a.timestamp - b.timestamp,
    );

    const formattedMessages: FormattedMessage[] = [];
    for (const message of sortedMessages) {
      formattedMessages.push({
        date: format(new Date(message.timestamp), "dd/MM/yyyy HH:mm"),
        text: message.text,
      });
    }

    const filename = `search/${today}/${keywordGroup}.json`;
    writeFileSync(filename, JSON.stringify(formattedMessages, null, 2));
  }
}
