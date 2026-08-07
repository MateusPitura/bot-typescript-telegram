# Update group list:

`npm run dev "updateGroupList"`

# Download new messages or history:

`npm run dev "fetchMessages"`

# Filter messages:

`npm run dev "filterMessages"`

The filter will be applied based on `KEYWORD` of `.env`. Accepted syntax:

- AND: "logitech_AND_mouse", will search for messages with "logitech" and "mouse"
- OR: "logitech_OR_apple", will search for messages with "logitech" or "apple", produce different output files
- Hyphen: "logitech_AND_-mouse", will search for messages with "logitech" but without "mouse"
- Date: "logitech_AND_2026-01-01", will search for messages with "logitech" until the date, inclusive, "2026-01-01"

The filtered messages will be saved in `search/<date>/<keyword>.json`

# Environment variables

`TELEGRAM_API_ID`, `TELEGRAM_API_HASH`: get them from [my.telegram.org](https://my.telegram.org)

`TELEGRAM_STRING_SESSION`: run the first time without it locally, the value will be printed in the console, copy it to `.env` for next runs

`PRIVATE_GROUP_ID`: a group that will receive the filtered messages

# Add a new group

Locally: run `npm run dev "updateGroupList"`
Remotely: access `https://telegram-bot-promo.mateuspitura.workers.dev/updateGroupList` in browser, should return "OK". Also update in Cloudflare panel the Workers KV JSON, set `last_message_id` to the last message id of the group, this avoid fetch all history in first run
