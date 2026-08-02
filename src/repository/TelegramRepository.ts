import { TelegramClient } from "telegram";
import { _MessagesIter } from "telegram/client/messages";
import { StringSession } from "telegram/sessions";
import { TelegramGroup } from "../types/telegramDto";
import { ask } from "../utils/ask";

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH!;
const phoneNumber = process.env.CELL_PHONE!;
const stringSessionValue = process.env.STRING_SESSION_VALUE || "";

const stringSession = new StringSession(stringSessionValue);

export class TelegramRepository {
  private connection: TelegramClient | null = null;

  async init() {
    this.connection = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    await this.connection.start({
      phoneNumber,
      phoneCode: async () => ask("Telegram Code: "),
      password: async () => ask("2FA Password (if enabled): "),
      onError: console.error,
    });

    if (!stringSessionValue) {
      console.log("String session value:", this.connection.session.save());
    }

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
}
