import Database from "better-sqlite3";
import fs from "node:fs";
import { Group, Message } from "./entities";

export class RelationalRepository {
  private databaseConnection: Database.Database | null = null;

  init() {
    fs.mkdirSync("data", { recursive: true });
    this.databaseConnection = new Database("data/database.db");
    this.databaseConnection.pragma("journal_mode = WAL");
    return this;
  }

  migrate() {
    if (!this.databaseConnection) {
      throw new Error("Database connection is not initialized.");
    }

    this.databaseConnection.exec(`
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
            date TEXT NOT NULL,
            text TEXT,
            UNIQUE(group_user_name, telegram_message_id),
            FOREIGN KEY(group_user_name) REFERENCES groups(user_name)
        );
    `);
  }

  createGroup(group: Pick<Group, "user_name" | "title">) {
    if (!this.databaseConnection) {
      throw new Error("Database connection is not initialized.");
    }

    this.databaseConnection
      .prepare(
        `
            INSERT INTO groups(
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
    group: Pick<Group, "user_name" | "last_message_id">,
  ) {
    if (!this.databaseConnection) {
      throw new Error("Database connection is not initialized.");
    }

    this.databaseConnection
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

  listGroups(): Group[] {
    if (!this.databaseConnection) {
      throw new Error("Database connection is not initialized.");
    }

    return this.databaseConnection
      .prepare(`SELECT * FROM groups`)
      .all() as Group[];
  }

  insertMessage(
    message: Pick<
      Message,
      "telegram_message_id" | "group_user_name" | "date" | "text"
    >,
  ) {
    if (!this.databaseConnection) {
      throw new Error("Database connection is not initialized.");
    }

    this.databaseConnection
      .prepare(
        `
            INSERT OR IGNORE INTO messages(
                telegram_message_id,
                group_user_name,
                date,
                text
            )
            VALUES (?, ?, ?, ?)
        `,
      )
      .run(
        message.telegram_message_id,
        message.group_user_name,
        message.date,
        message.text,
      );
  }

  listMessages(): Message[] {
    if (!this.databaseConnection) {
      throw new Error("Database connection is not initialized.");
    }

    return this.databaseConnection
      .prepare(`SELECT * FROM messages`)
      .all() as Message[];
  }
}
