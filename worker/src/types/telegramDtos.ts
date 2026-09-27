export interface TelegramGroup {
  title: string;
  entity: {
    username: string;
  };
  message: {
    id: number;
  };
}

export interface TelegramShortDescription {
  result: {
    short_description: string;
  };
}