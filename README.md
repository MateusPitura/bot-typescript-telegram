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