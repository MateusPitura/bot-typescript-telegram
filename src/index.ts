import "dotenv/config";
import { updateGroupList } from "../worker/src/updateGroupList";
import { fetchMessages } from "./fetchMessages";
import { filterMessages } from "./filterMessages";
import { DatabaseRepository } from "./repository/DatabaseRepository";
import { TelegramRepository } from "./repository/TelegramRepository";

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
      await filterMessages(databaseRepository);
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
