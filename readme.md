# KuznetsovX JS Discord Bot DBD

A personal-use Discord bot for **Dead by Daylight (DBD)** community, built in JavaScript with `discord.js`.
This bot is designed to enhance server management, user interactions, and role management, all while keeping things fun and lighthearted.

This project is **under development**.

---

## Invite

This bot is currently configured for one specific Discord server (the one linked below):
[Discord Server Invite](https://discord.gg/JZJxjtFXag)

The repository is public for transparency and learning purposes — feel free to fork it and adapt it for your own community.
Just note that all IDs, roles, and channel setups are tied to my server, so you’ll need to reconfigure those before running it elsewhere (see "Important Note About Configuration").

---

## Features

- Modular command structure for easy customization
- Role management: promote, demote, assign default roles, etc.
- Persistent database integration for tracking user roles and data
- Logging and utility functions for cleaner bot operation
- …and more features coming someday!

---

## Prerequisites

Before installing the bot, make sure you have:

- [Node.js](https://nodejs.org/en/download) (v18 or newer recommended)
- [PostgreSQL](https://www.postgresql.org/download/) (v14 or newer)
  - Create a database and user with the required permissions.
  - Keep your database credentials handy for the `.env` file.

### PostgreSQL setup

1. Install PostgreSQL

    - **Windows**: Download and run the installer from [here](https://www.postgresql.org/download/windows/), or use PowerShell:
    ```powershell
    winget install PostgreSQL.PostgreSQL
    ```

    - **Linux (Debian/Ubuntu)**:
    ```bash
    sudo apt update
    sudo apt install postgresql postgresql-contrib
    ```

    - **macOS (Homebrew)**:
    ```bash
    brew install postgresql
    ```

2. Create a database and user (replace values as needed):
```sql
CREATE DATABASE dbd_bot;
CREATE USER dbd_user WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE dbd_bot TO dbd_user;
```

3. Make sure PostgreSQL is running, then keep these credentials handy for your .env file.

---

## Important Note About Configuration

This bot is currently **customized for a specific server** and will not work out-of-the-box for other servers.

All roles, channels, emojis, and reaction-role mappings are configured for the original server.
If you want to run this bot on your own server, you must:
  1. Clear the current configuration in `src/config/` (roles, channels, emoji mappings, etc.)
  2. Redefine the configuration to match your server’s roles, channels, and preferences.
Failing to do so may result in errors or unexpected behavior.

Alternatively, you can mimic the original server setup, but you’ll still need to update IDs inside the config files.

> In short: you can use the bot code, but your server needs a **full configuration setup** to match your own roles and channels.

### Future Plans

In the future, a **dynamic configuration system** may be implemented — so you won’t have to go through “rewriting hell” in the config files.
This would allow the bot to automatically adapt to different servers by dynamically detecting or generating roles, channels, and other settings instead of relying on hardcoded IDs.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/KuznetsovX/KuznetsovX_JS_Discord-Bot-DBD.git
cd KuznetsovX_JS_Discord-Bot-DBD
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root and add your bot token and any required environment variables:

```env
# Discord bot settings
DISCORD_TOKEN=your-bot-token
OWNER_ID=your-discord-id
INVITE_LINK=your-server-invite-link

# PostgreSQL database settings
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_HOST=your-db-hostname
DB_PORT=your-db-port
DB_DIALECT=your-db-dialect

## pg_dump paths for backups
PG_DUMP_PATH=path-to-your-db-dump            # required
PG_DUMP_PATH_ALT=path-to-alternative-db-dump # optional fallback
```

4. Start the bot:

```bash
npm start
```

---

## Usage

Commands are prefixed with `!` or `?`.

> Check `src/config/index.js` for more information about prefixes.

For a full list of commands:

```
!help
?help
```

Example commands:

```
!give @user @role   – Adds a role to a user
!take @user @role   – Removes a role from a user
!clean              – Clear chat messages
!list               – Display all tracked users
```

**The bot responds only to commands it understands. It doesn’t like yelling.**

---

## Contributing

1. Fork the repository

2. Create a branch:

```bash
git checkout -b feature/my-feature
```

3. Make your changes and commit them:

```bash
git commit -m "feat: add my feature"
```

4. Push to your branch:

```bash
git push origin feature/my-feature
```

5. Open a pull request

> Contributions are welcome, but please remember this bot is primarily for personal use, so keep changes compatible with the existing structure.

---

## License

This project is licensed under the MIT License.

---

## Credits

- Map images taken from [Hens333](https://hens333.com/callouts) and from [DBDL](https://discord.gg/dbdleague)
- Tile images taken from [EagerFace](https://steamcommunity.com/sharedfiles/filedetails/?id=2904838739)

> Thanks for creating such awesome content! These assets are used only for this personal-use Discord bot.

---

**Fueled by snacks and stack traces.**
> Keep calm and check `!help` before panicking.
