import { DatabaseGroup, DatabaseMessage } from "../types/databaseDtos";
import { DatabaseInterface } from "./DatabaseInterface";

export class DatabaseRepository implements DatabaseInterface {
  private kv: KVNamespace | undefined;
  private databaseMessages: DatabaseMessage[] = [];

  private migrate() {
    this.databaseMessages = [];
  }

  init(KV: KVNamespace) {
    this.kv = KV;
    this.migrate();
    return this;
  }

  createGroup(
    group: Pick<DatabaseGroup, "user_name" | "title">,
  ): Promise<void> {
    if (!this.kv) {
      throw new Error("Database connection is not initialized.");
    }
    const key = `group:${group.user_name}`;
    const value = JSON.stringify({
      ...group,
      last_message_id: 0,
    });
    return this.kv.put(key, value);
  }

  async updateGroupLastMessageId(
    group: Pick<DatabaseGroup, "user_name" | "last_message_id">,
  ): Promise<void> {
    if (!this.kv) {
      throw new Error("Database connection is not initialized.");
    }
    const key = `group:${group.user_name}`;
    return this.kv.get(key).then((value) => {
      if (!value) {
        throw new Error(`Group with user_name ${group.user_name} not found.`);
      }
      const groupData = JSON.parse(value);
      groupData.last_message_id = group.last_message_id;
      return this.kv!.put(key, JSON.stringify(groupData));
    });
  }

  async listGroups(): Promise<DatabaseGroup[]> {
    if (!this.kv) {
      throw new Error("Database connection is not initialized.");
    }
    const list = await this.kv.list({ prefix: "group:" });
    const groups: DatabaseGroup[] = [];
    for (const key of list.keys) {
      const value = await this.kv.get(key.name);
      if (value) {
        groups.push(JSON.parse(value));
      }
    }
    return groups;
  }

  insertMessage(
    message: Pick<
      DatabaseMessage,
      "telegram_message_id" | "group_user_name" | "timestamp" | "text"
    >,
  ): void {
    this.databaseMessages.push({
      id: this.databaseMessages.length + 1,
      ...message,
    });
  }

  listMessages(): DatabaseMessage[] {
    return this.databaseMessages;
  }
}
