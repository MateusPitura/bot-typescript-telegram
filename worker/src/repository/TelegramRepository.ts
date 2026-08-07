import { TelegramClient } from "telegram";
import { _MessagesIter } from "telegram/client/messages";
import { StringSession } from "telegram/sessions";
import { TelegramGroup } from "../types/telegramDtos";

export class TelegramRepository {
  protected connection: TelegramClient | null = null;

  async init(env: Env) {
    const telegramSessionValue = env.TELEGRAM_STRING_SESSION;

    const stringSession = new StringSession(telegramSessionValue);

    this.connection = new TelegramClient(
      stringSession,
      Number(env.TELEGRAM_API_ID),
      env.TELEGRAM_API_HASH,
      {
        connectionRetries: 5,
      },
    );

    await this.connection.start({
      phoneNumber: async () => "",
      phoneCode: async () => "",
      password: async () => "",
      onError: console.error,
    });

    return this;
  }

  async listGroups(): Promise<TelegramGroup[]> {
    if (!this.connection) {
      throw new Error("Telegram connection is not initialized.");
    }

    return this.connection.getDialogs({}) as unknown as TelegramGroup[];
  }

  iterateMessages(groupUserName: string, minId?: number): _MessagesIter {
    if (!this.connection) {
      throw new Error("Telegram connection is not initialized.");
    }

    const iter = this.connection.iterMessages(groupUserName, {
      minId,
    });

    return iter as _MessagesIter;
  }

  async disconnect() {
    if (!this.connection) {
      throw new Error("Telegram connection is not initialized.");
    }

    await this.connection.disconnect();
  }

  async sendMessage(receiverId: number, messages: string[]) {
    if (!this.connection) {
      throw new Error("Telegram connection is not initialized.");
    }

    for (const message of messages) {
      await this.connection.sendMessage(receiverId, {
        message,
      });
    }
  }
}
