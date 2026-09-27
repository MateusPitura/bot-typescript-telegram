import { FilteredMessage } from "../types";
import { cleanMessage } from "./cleanMessage";
import { formatTimestamp } from "./formatTimestamp";

export function formatMessagesToSend(
  keywordGroupFilteredMessagesMap: Map<string, FilteredMessage[]>,
): string[] {
  return Array.from(keywordGroupFilteredMessagesMap.values())
    .flat()
    .map((item) => `[${formatTimestamp(item.timestamp)}]: ${cleanMessage(item.text)}`);
}
