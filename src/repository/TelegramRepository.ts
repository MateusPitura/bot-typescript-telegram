import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { TelegramRepository as WorkerTelegramRepository } from "../../worker/src/repository/TelegramRepository";
import { ask } from "../utils/ask";

export class TelegramRepository extends WorkerTelegramRepository {
  async init() {
    const telegramSessionValue = process.env.TELEGRAM_STRING_SESSION || "";

    const stringSession = new StringSession(telegramSessionValue);

    this.connection = new TelegramClient(
      stringSession,
      Number(process.env.TELEGRAM_API_ID),
      process.env.TELEGRAM_API_HASH!,
      {
        connectionRetries: 5,
      },
    );

    await this.connection.start({
      phoneNumber: async () => process.env.CELL_PHONE!,
      phoneCode: async () => ask("Telegram Code: "),
      password: async () => ask("2FA Password (if enabled): "),
      onError: console.error,
    });

    if (!telegramSessionValue) {
      console.log("String session value:", this.connection.session.save());
    }

    return this;
  }
}
