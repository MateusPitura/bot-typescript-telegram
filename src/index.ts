import "dotenv/config";

import { updateGroupList } from "../shared/updateGroupList";
import { fetchMessages } from "./fetchMessages";
import { filterMessages } from "./filterMessages";
import { DatabaseRepository } from "./repository/DatabaseRepository";

async function main() {
  const databaseRepository = new DatabaseRepository().init();

  switch (process.argv[2]) {
    case "updateGroupList":
      await updateGroupList(databaseRepository);
      break;
    case "filterMessages":
      await filterMessages(databaseRepository);
      break;
    case "fetchMessages":
      await fetchMessages(databaseRepository);
      break;
    default:
      console.log("Invalid command");
  }

  process.exit(0);
}

main().catch(console.error);
