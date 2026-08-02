import Database from "better-sqlite3";
import fs from "node:fs";
import { DatabaseGroup, DatabaseMessage } from "../types/databaseDtos";

export class DatabaseRepository {
  private connection: Database.Database | null = null;

  private migrate() {
    if (!this.connection) {
      throw new Error("Database connection is not initialized.");
    }

    this.connection.exec(`
        CREATE TABLE IF NOT EXISTS groups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL,
            last_message_id INTEGER DEFAULT 0,
            updated_at TEXT
        );

        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            telegram_message_id INTEGER NOT NULL,
            group_user_name TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            text TEXT,
            UNIQUE(group_user_name, telegram_message_id),
            FOREIGN KEY(group_user_name) REFERENCES groups(user_name)
        );
    `);
  }

  init() {
    fs.mkdirSync("data", { recursive: true });
    this.connection = new Database("data/database.db");
    this.connection.pragma("journal_mode = WAL");
    this.migrate();
    return this;
  }

  createGroup(group: Pick<DatabaseGroup, "user_name" | "title">) {
    if (!this.connection) {
      throw new Error("Database connection is not initialized.");
    }

    this.connection
      .prepare(
        `
          INSERT OR IGNORE INTO groups (
            user_name,
            title,
            updated_at
          )
          VALUES (?, ?, ?)
        `,
      )
      .run(group.user_name, group.title, new Date().toISOString());
  }

  updateGroupLastMessageId(
    group: Pick<DatabaseGroup, "user_name" | "last_message_id">,
  ) {
    if (!this.connection) {
      throw new Error("Database connection is not initialized.");
    }

    this.connection
      .prepare(
        `
            UPDATE groups
            SET
                last_message_id = ?,
                updated_at = ?
            WHERE user_name = ?
        `,
      )
      .run(group.last_message_id, new Date().toISOString(), group.user_name);
  }

  listGroups(): DatabaseGroup[] {
    if (!this.connection) {
      throw new Error("Database connection is not initialized.");
    }

    return this.connection
      .prepare(`SELECT * FROM groups`)
      .all() as DatabaseGroup[];
  }

  insertMessage(
    message: Pick<
      DatabaseMessage,
      "telegram_message_id" | "group_user_name" | "timestamp" | "text"
    >,
  ) {
    if (!this.connection) {
      throw new Error("Database connection is not initialized.");
    }

    this.connection
      .prepare(
        `
            INSERT OR IGNORE INTO messages(
                telegram_message_id,
                group_user_name,
                timestamp,
                text
            )
            VALUES (?, ?, ?, ?)
        `,
      )
      .run(
        message.telegram_message_id,
        message.group_user_name,
        message.timestamp,
        message.text,
      );
  }

  listMessages(): DatabaseMessage[] {
    if (!this.connection) {
      throw new Error("Database connection is not initialized.");
    }

    return this.connection
      .prepare(`SELECT * FROM messages`)
      .all() as DatabaseMessage[];
  }
}
