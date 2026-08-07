import "dotenv/config";
import { fetchMessages } from "../worker/src/fetchMessages";
import { filterMessages } from "../worker/src/filterMessages";
import { updateGroupList } from "../worker/src/updateGroupList";
import { DatabaseRepository } from "./repository/DatabaseRepository";
import { TelegramRepository } from "./repository/TelegramRepository";
import { saveMessages } from "./utils/saveMessages";

async function main() {
  const method = process.argv[2];
  const databaseRepository = new DatabaseRepository().init();
  let telegramRepository: TelegramRepository | undefined;

  switch (method) {
    case "updateGroupList":
      telegramRepository = await new TelegramRepository().init();
      await updateGroupList(
        databaseRepository,
        telegramRepository,
        process.env.IGNORE_GROUPS?.split(",") || [],
      );
      telegramRepository.disconnect();
      break;
    case "filterMessages":
      const filteredMessages = await filterMessages(databaseRepository);
      saveMessages(filteredMessages);
      break;
    case "fetchMessages":
      telegramRepository = await new TelegramRepository().init();
      await fetchMessages(databaseRepository, telegramRepository);
      telegramRepository.disconnect();
      break;
    default:
      console.log("Invalid command");
  }

  process.exit(0);
}

main().catch(console.error);
