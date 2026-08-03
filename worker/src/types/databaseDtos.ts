export interface DatabaseGroup {
  id: number;
  user_name: string;
  title: string;
  last_message_id: number;
  updated_at: string;
}

export interface DatabaseMessage {
  id: number;
  telegram_message_id: number;
  group_user_name: string;
  timestamp: number;
  text: string | null;
}
