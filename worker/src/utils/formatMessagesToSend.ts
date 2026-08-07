import { FilteredMessage } from "../types";
import { cleanMessage } from "./cleanMessage";

export function formatMessagesToSend(
  keywordGroupFilteredMessagesMap: Map<string, FilteredMessage[]>,
): string[] {
  return Array.from(keywordGroupFilteredMessagesMap.values())
    .flat()
    .map((item) => cleanMessage(item.text));
}
