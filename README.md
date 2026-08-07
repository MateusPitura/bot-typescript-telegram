<h1 align="center">
  <p>Telegram Message Filter</p>
</h1>

<p> 
  <img src="https://img.shields.io/badge/Release-Aug%202026-green">  
  <img src="https://img.shields.io/github/stars/MateusPitura/bot-typescript-telegram?style=social"> 
</p>

## Description

A Telegram message filtering tool that retrieves messages from groups, searches them using configurable keywords, and saves the matching messages as JSON files or send them via Telegram

The project can run locally or remotely through a Cloudflare Worker

- [Features](#features)
- [How to Run](#how-to-run)
- [Technologies Used](#technologies-used)
- [Authors](#authors)

## Features

:inbox_tray: **Fetch messages:** downloads new messages or historical messages from the configured groups

:mag: **Filter messages:** searches messages using a configurable keyword syntax

:cloud: **Cloudflare worker:** supports remotely updating the group list and running scheduled filtering tasks

## How to Run

### Locally

Update group list: `npm run dev "updateGroupList"`

Download new messages or history: `npm run dev "fetchMessages"`

Filter messages: `npm run dev "filterMessages"`, the filter is based on the `KEYWORD` environment variable and the filtered messages are saved to the `search/<date>/<keyword>.json` folder

### Remotely

Deploy new version: `worker/npm run deploy`

Update group list: open the following endpoint in a browser: https://telegram-bot-promo.mateuspitura.workers.dev/updateGroupList. It should return "OK". After adding the group, update the Cloudflare Workers KV JSON in the Cloudflare dashboard, setting `last_message_id` to the last message ID of the group. This prevents the worker from fetching the entire message history on its first run

Download and filter messages: this is automatically done as configured in `wrangler.jsonc` with the `triggers` property

### Filter Syntax

| Syntax | Description                                               | Example                   |
| ------ | --------------------------------------------------------- | ------------------------- |
| `AND`  | Searches for messages containing both terms               | `logitech_AND_mouse`      |
| `OR`   | Searches for messages containing either term              | `logitech_OR_apple`       |
| `-`    | Excludes messages containing the specified term           | `logitech_AND_-mouse`     |
| Date   | Searches for messages until the specified date, inclusive | `logitech_AND_2026-01-01` |

### Environment Variables

`TELEGRAM_API_ID` and `TELEGRAM_API_HASH`: get these credentials from [my.telegram.org](https://my.telegram.org)

`TELEGRAM_STRING_SESSION`: the first time you run the project locally, leave this variable empty. The Telegram session string will be printed in the console. Save it so it can be reused on subsequent runs

`PRIVATE_GROUP_ID`: the ID of the private Telegram group that will receive the filtered messages

## Technologies Used

<!-- Link for badges: https://github.com/Ileriayo/markdown-badges -->

<p align="left">
  <img src="https://img.shields.io/badge/TypeScript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram"/>
  <img src="https://img.shields.io/badge/Cloudflare%20Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Workers"/>
  <img src="https://img.shields.io/badge/SQLite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite"/>
</p>

## Authors

| Mateus Pitura                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <p align="center"><img src="https://avatars.githubusercontent.com/u/119008106" width="100" height="100"></p>                                                                          |
| <a href="https://url.mateuspitura.com?q=linkedin.com/in/mateuspitura/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a> |
