import { format } from "date-fns";
import { writeFileSync } from "node:fs";
import { FilteredMessage } from "../../worker/src/types";
import { cleanMessage } from "../../worker/src/utils/cleanMessage";
import { extractLowestPrice } from "./extractLowestPrice";
import { extractPrices } from "./extractPrices";

interface FormattedMessage {
  date: string;
  text: string;
  prices: string[];
  lowestPrice: number;
}

export function saveMessages(
  keywordGroupFilteredMessagesMap: Map<string, FilteredMessage[]>,
): void {
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
      const prices = extractPrices(message.text);

      formattedMessages.push({
        date: format(new Date(message.timestamp), "dd/MM/yyyy HH:mm"),
        text: cleanMessage(message.text),
        prices,
        lowestPrice: extractLowestPrice(prices),
      });
    }

    const filename = `search/${today}/${keywordGroup}.json`;
    writeFileSync(
      filename,
      JSON.stringify(
        formattedMessages.sort((a, b) => a.lowestPrice - b.lowestPrice),
        null,
        2,
      ),
    );
  }
}
