import { format } from "date-fns";
import { writeFileSync } from "node:fs";
import { DatabaseInterface } from "./repository/DatabaseInterface";
import { cleanMessage } from "./utils/cleanMessage";

interface FilteredMessage {
  timestamp: number;
  text: string;
}

interface FormattedMessage {
  date: string;
  text: string;
}

const DATE_REGEX = /\d{4}-\d{2}-\d{2}/;

const KEYWORD = process.env.KEYWORD || "";

export async function filterMessages(databaseRepository: DatabaseInterface) {
  const messages = await databaseRepository.listMessages();

  console.log(`Loaded ${messages.length} messages\n`);

  const keywordGroupFilteredMessagesMap: Map<string, FilteredMessage[]> =
    new Map();
  for (const message of messages) {
    const text = message.text?.toLowerCase() || "";

    for (const keywordGroup of KEYWORD.split("_OR_")) {
      let dateFilter = null;

      const containsAllKeywords = keywordGroup
        .split("_AND_")
        .every((keyword) => {
          if (DATE_REGEX.test(keyword)) {
            dateFilter = new Date(keyword).getTime();
            return true;
          }

          if (keyword.startsWith("-")) {
            return !text.includes(keyword.substring(1));
          }
          return text.includes(keyword);
        });

      if (!containsAllKeywords) continue;
      if (dateFilter && message.timestamp < dateFilter) continue;

      const keywordGroupFilteredMessages =
        keywordGroupFilteredMessagesMap.get(keywordGroup);
      const filteredMessage = {
        timestamp: message.timestamp,
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
      (a, b) => b.timestamp - a.timestamp,
    );

    const formattedMessages: FormattedMessage[] = [];
    for (const message of sortedMessages) {
      formattedMessages.push({
        date: format(new Date(message.timestamp), "dd/MM/yyyy HH:mm"),
        text: cleanMessage(message.text),
      });
    }

    const filename = `search/${today}/${keywordGroup}.json`;
    writeFileSync(filename, JSON.stringify(formattedMessages, null, 2));
  }
}
