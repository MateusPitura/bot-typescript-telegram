import { filterSendMessages } from "./filterSendMessages";
import { DatabaseRepository } from "./repository/DatabaseRepository";
import { TelegramRepository } from "./repository/TelegramRepository";
import { updateGroupList } from "./updateGroupList";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!env.API_KEY) {
      return new Response("Server configuration error", {
        status: 500,
      });
    }
    if (url.searchParams.get("API_KEY") !== env.API_KEY) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const method = url.pathname.replace("/", "");
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
      case "filterSendMessages":
        await filterSendMessages(env);
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
    await filterSendMessages(env);
  },
} satisfies ExportedHandler<Env>;
