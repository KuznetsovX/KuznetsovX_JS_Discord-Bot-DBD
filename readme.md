# KuznetsovX JS Discord Bot DBD

A personal-use Discord bot for **Dead by Daylight (DBD)** community, built in JavaScript with `discord.js`.
This bot is designed to enhance server management, user interactions, and role management, all while keeping things fun and lighthearted.

This project is **under development**.

---

## Invite

This bot is intended for use exclusively on this server:
[Discord Server Invite](https://discord.com/invite/VRR5X8ZdXB)

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

- Map images taken from [Hens333](https://hens333.com/callouts)
- Tile images taken from [EagerFace](https://steamcommunity.com/sharedfiles/filedetails/?id=2904838739)

> Thanks for creating such awesome content! These assets are used only for this personal-use Discord bot.

---

**Fueled by snacks and stack traces.**
> Keep calm and check `!help` before panicking.
