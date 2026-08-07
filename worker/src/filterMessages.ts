import { DatabaseInterface } from "./repository/DatabaseInterface";
import { FilteredMessage } from "./types";

const DATE_REGEX = /\d{4}-\d{2}-\d{2}/;

export async function filterMessages(
  databaseRepository: DatabaseInterface,
  fullKeyword: string,
): Promise<Map<string, FilteredMessage[]>> {
  const messages = await databaseRepository.listMessages();

  console.log(`Loaded ${messages.length} messages\n`);

  const keywordGroupFilteredMessagesMap: Map<string, FilteredMessage[]> =
    new Map();
  for (const message of messages) {
    const text = message.text?.toLowerCase() || "";

    for (const keywordGroup of fullKeyword.split("_OR_")) {
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

  return keywordGroupFilteredMessagesMap;
}
