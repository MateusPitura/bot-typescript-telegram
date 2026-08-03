import { DatabaseGroup, DatabaseMessage } from "../types/databaseDtos";

export interface DatabaseInterface {
  createGroup(
    group: Pick<DatabaseGroup, "user_name" | "title">,
  ): Promise<void> | void;
  updateGroupLastMessageId(
    group: Pick<DatabaseGroup, "user_name" | "last_message_id">,
  ): Promise<void> | void;
  listGroups(): Promise<DatabaseGroup[]> | DatabaseGroup[];
  insertMessage(
    message: Pick<
      DatabaseMessage,
      "telegram_message_id" | "group_user_name" | "timestamp" | "text"
    >,
  ): Promise<void> | void;
  listMessagesByGroup(
    groupUserName: string,
  ): Promise<DatabaseMessage[]> | DatabaseMessage[];
}
