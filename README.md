# InstaBot — Instagram Auto DM & Comment Reply

A self-hosted automation tool that automatically replies to Instagram comments and sends DMs to users who comment on your posts or reels. Built with React + Vite (frontend) and Express.js (backend).

> Created by [@whoanuragbhatt](https://instagram.com/whoanuragbhatt)

---

## Features

- Auto reply to comments on any / next / specific posts or reels
- Auto DM users after they comment (via Instagram Messaging API)
- Follow gate — ask users to follow before delivering a link
- Value delivery — send a link/resource via DM button
- Keyword filter — trigger only on specific keywords
- Multiple reply variants (picked at random)
- Live dashboard with stats (replies, DMs, clicks, followers, emails)
- Real-time webhook processing via Meta Webhooks

---

## Tech Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS v4, Framer Motion
- **Backend:** Express.js, Instagram Graph API v18
- **Webhooks:** Meta Webhooks → ngrok (local) or any public HTTPS server
- **Config store:** Local JSON file (`.automation-config.json`)

---

## Required Keys & IDs

Create a `.env` file in the root directory:

```env
# Long-lived Instagram Page Access Token (60-day expiry)
# Get from: Meta App Dashboard → Graph API Explorer → select your Facebook Page → Generate Access Token
# Exchange for long-lived token:
# curl "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=SHORT_TOKEN"
INSTAGRAM_ACCESS_TOKEN=your_page_access_token_here

# Instagram Business Account ID
# Get from: Instagram app → Settings → Account → Professional Account
# Or: Graph API Explorer → GET /me?fields=id (after selecting your IG account)
INSTAGRAM_ACCOUNT_ID=your_instagram_account_id

# Facebook Page ID linked to your Instagram account
# Get from: Graph API Explorer → GET /me/accounts → copy the page id
# Or: facebook.com/your-page → About → Page ID
FACEBOOK_PAGE_ID=your_facebook_page_id

# Google Sheet ID (optional — for logging)
# From URL: docs.google.com/spreadsheets/d/{SHEET_ID}/edit
GOOGLE_SHEET_ID=your_google_sheet_id

# Server port (default 3001)
PORT=3001
```

---

## Meta App Setup

### Create a Meta Developer App
1. Go to [developers.facebook.com](https://developers.facebook.com) → My Apps → Create App
2. Select **Business** type
3. Add the **Instagram** use case: "Manage messaging & content on Instagram"

### App Credentials
| Field | Where to find |
|-------|--------------|
| App ID | Meta App Dashboard → Settings → Basic |
| App Secret | Meta App Dashboard → Settings → Basic |

### Required Permissions
| Permission | Purpose | Access Level |
|-----------|---------|-------------|
| `instagram_basic` | Read account info and media | Standard |
| `instagram_manage_comments` | Post public comment replies | Standard |
| `instagram_manage_messages` | Send DMs | **Advanced — requires App Review** |
| `pages_show_list` | List connected Facebook Pages | Standard |
| `pages_read_engagement` | Read Page data | Standard |

### Webhook Configuration
| Field | Value |
|-------|-------|
| Callback URL | `https://your-domain.com/webhook` |
| Verify Token | `instabot_verify_2026` |
| Subscribe Fields | `comments`, `messages` |

> For local development, use [ngrok](https://ngrok.com) to expose `localhost:3001` publicly:
> ```bash
> ngrok http 3001
> ```

### Prerequisites
- Instagram account must be a **Professional (Business/Creator)** account
- Instagram account must be **connected to a Facebook Page**
- Meta App must be in **Published** state for webhooks to fire on all users

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with your credentials (see above)

# 3. Start both server and frontend
npm start
```

- Admin UI: `http://localhost:5173`
- API server: `http://localhost:3001`

---

## How It Works

```
User comments on your post
        ↓
Meta sends webhook → POST /webhook
        ↓
Server checks: active? correct post? keyword match?
        ↓
Posts public comment reply
        ↓
Sends opening DM via private_replies
        ↓
Checks follow status
        ↓
Following → sends value link button
Not following → sends follow gate message
```

---

## Project Structure

```
instagram-admin/
├── server.js                        # Express backend + webhook handler
├── src/
│   ├── App.jsx                      # Root with screen routing
│   ├── screens/
│   │   ├── Dashboard.jsx            # Automation cards view
│   │   ├── AutomationBuilder.jsx    # Step-by-step builder
│   │   └── PrivacyPolicy.jsx        # Privacy policy page
│   ├── components/
│   │   ├── PostSelector.jsx         # Post/reel picker
│   │   ├── KeywordFilter.jsx        # Keyword trigger
│   │   ├── CommentReplies.jsx       # Public reply editor
│   │   ├── DMSequence.jsx           # DM flow builder
│   │   ├── AdminValue.jsx           # Value/link delivery
│   │   ├── Toggle.jsx               # Toggle switch
│   │   ├── StatsBar.jsx             # Stats bar
│   │   └── Footer.jsx               # Footer
│   └── lib/
│       └── api.js                   # Frontend API client
├── .env                             # Secrets (not committed)
├── .automation-config.json          # Local config store (not committed)
└── package.json
```

---

## Important Notes

- **DM functionality** requires `instagram_manage_messages` **Advanced Access** approved via Meta App Review. Comment replies work immediately without it.
- **Token expiry:** Page access tokens expire in 60 days. Re-generate and update `.env` before expiry.
- **Webhook verify token** defaults to `instabot_verify_2026` — change it in `server.js` and update your Meta webhook settings if needed.
- **App must be Published** in Meta App Dashboard for webhooks to fire for non-tester accounts.

---

## License

MIT — Free to use and modify.

© 2026 InstaBot · Created by [@whoanuragbhatt](https://instagram.com/whoanuragbhatt)
