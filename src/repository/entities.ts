export interface Group {
  id: number;
  user_name: string;
  title: string;
  last_message_id: number;
  updated_at: string;
}

export interface Message {
  id: number;
  telegram_message_id: number;
  group_user_name: string;
  timestamp: number;
  text: string | null;
}