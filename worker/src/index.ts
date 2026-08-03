import { DatabaseRepository } from "./repository/DatabaseRepository";
import { TelegramRepository } from "./repository/TelegramRepository";
import { updateGroupList } from "./updateGroupList";

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
} satisfies ExportedHandler<Env>;
