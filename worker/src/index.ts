import { fetchMessages } from "./fetchMessages";
import { filterMessages } from "./filterMessages";
import { DatabaseRepository } from "./repository/DatabaseRepository";
import { TelegramRepository } from "./repository/TelegramRepository";
import { updateGroupList } from "./updateGroupList";
import { formatMessagesToSend } from "./utils/formatMessagesToSend";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const method = new URL(request.url).pathname.replace("/", "");
    const databaseRepository = new DatabaseRepository().init(env.KV);
    let telegramRepository: TelegramRepository | undefined;

    switch (method) {
      case "updateGroupList":
        telegramRepository = await new TelegramRepository().init(env);
        await updateGroupList(
          databaseRepository,
          telegramRepository,
          env.IGNORE_GROUPS.split(",") || [],
        );
        telegramRepository.disconnect();
        break;
      default:
        return new Response("Not Found", {
          status: 404,
        });
    }

    return new Response("OK", {
      status: 200,
    });
  },

  async scheduled(_, env) {
    const databaseRepository = new DatabaseRepository().init(env.KV);
    const telegramRepository = await new TelegramRepository().init(env);
    await fetchMessages(databaseRepository, telegramRepository);
    const keyword = await telegramRepository.getGroupDescription(
      Number(process.env.PRIVATE_GROUP_ID),
    );
    if (!keyword) return;
    const filteredMessages = await filterMessages(databaseRepository, keyword);
    await telegramRepository.sendMessage(
      Number(process.env.PRIVATE_GROUP_ID),
      formatMessagesToSend(filteredMessages),
    );
  },
} satisfies ExportedHandler<Env>;
