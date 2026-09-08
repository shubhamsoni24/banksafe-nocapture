# 🛡️ BankSafe NoCapture

A lightweight Chrome extension that **alerts you to stop screen recording** the moment you open any banking or financial website. Built with Manifest V3, completely private, and under 5 KB.

> **⚠️ Banking site detected**
> A banking or financial site is open. Please ensure all screen recording and screen capture tools are turned off before you proceed.

---

## Why this exists

Screen sharing during calls, tutorial recordings, and streaming are everyday activities — but forgetting to pause when switching to a banking tab can expose credentials, balances, and personal data. **BankSafe NoCapture** acts as a safety net by firing an unmissable notification the instant a banking tab becomes active.

---

## ✨ Features

- 🏦 **Broad coverage** — detects 200+ banking and financial domains worldwide
- 🔔 **Persistent notification** — stays visible until dismissed, with sound
- 🟢 **Toolbar badge** — green when on a financial site, grey when disabled
- 🎛️ **Popup dashboard** — toggle protection, view status, and track alert count
- ⚙️ **Settings page** — add or remove custom keywords, import/export as JSON
- 🔕 **Non-intrusive** — one alert per site per tab, no repeated nagging
- 🔒 **100% private** — no network calls, no tracking, no data leaves your machine
- ⚡ **Tiny footprint** — zero dependencies, no build step, installs in seconds

---

## 🧠 How detection works

The extension watches for tab navigations and switches, then checks each URL against three rules:

| Priority | Rule | What it catches |
|----------|------|-----------------|
| 1 | Hostname contains **`bank`** | Domains like `*.bank.in`, `netbanking.*`, `onlinebanking.*` |
| 2 | Hostname contains **`card`** | Card management portals and payment gateways |
| 3 | **Keyword list** | Known financial domains that don't have "bank" or "card" in the URL |

Keyword matching uses **hostname label boundaries** — so a keyword like `iob` matches `iob.in` and `www.iob.in` but won't falsely trigger on unrelated domains like `ioby.org`.

### What's covered

- All major **public and private sector banks** in India (RBI scheduled list)
- **Regional rural banks** and small finance banks
- **International banks** — US, UK, EU, Middle East, and Asia-Pacific
- **Card and payment portals**
- **Any custom domains** you add through the settings page

> 💡 India's new `.bank.in` domain migration means newer banking URLs are caught automatically by Rule 1 — no keyword needed.

---

## 📥 Installation

1. [**Download the ZIP**](https://github.com/shubhamsoni24/banksafe-nocapture/archive/refs/heads/master.zip) and extract it
2. Open `chrome://extensions` (also works in Edge, Brave, and Arc)
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked** → select the `extension/` folder
5. Open any banking website to test — you should see the notification instantly

---

## 🎛️ Usage

### Popup
Click the 🛡️ toolbar icon to:
- **Toggle protection** on or off
- See whether the current tab is flagged
- View your total alert count

### Settings
Right-click the toolbar icon → **Options**, or click ⚙️ in the popup:
- **Add keywords** — type a domain keyword and hit Enter
- **Remove keywords** — click × on any custom tag
- **Import / Export** — share your keyword list as JSON
- **Reset** — clear all custom keywords (built-in list stays intact)

---

## 🔒 Privacy

| | |
|---|---|
| **Reads page content?** | Never — no content scripts |
| **Sends data anywhere?** | No — zero network requests in the entire codebase |
| **Stores browsing data?** | No — only your toggle state and custom keywords, locally |
| **Why the `tabs` permission?** | Required to read tab URLs for matching — cannot modify pages |

---

## 📁 Project structure

```
banksafe-nocapture/
├── extension/                 # Chrome extension (load this folder)
│   ├── manifest.json          # Extension config (MV3)
│   ├── background.js          # Detection engine, badge, notifications
│   ├── icons/
│   │   └── icon128.png        # Toolbar and notification icon
│   ├── popup/
│   │   ├── popup.html         # Popup UI
│   │   ├── popup.js           # Popup logic
│   │   └── popup.css          # Popup styles
│   └── options/
│       ├── options.html       # Settings page UI
│       ├── options.js         # Settings logic
│       └── options.css        # Settings styles
├── website/
│   └── index.html             # Landing page (deployable to Vercel)
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🌐 Website

[banksafe-nocapture.vercel.app](https://banksafe-nocapture.vercel.app)

---

## ⚠️ Limitations

This is a **reminder tool, not a security control**. It cannot detect:

- Banking sites opened via IP address instead of domain name
- URL shortener redirects that resolve after the initial check
- Banking content embedded inside another site's iframe

---

## 🤝 Contributing

Found a financial domain that isn't detected? Open an issue or PR — or simply add it through the settings page.

## 📄 License

[MIT](LICENSE) · Built by [Shubham Soni](https://github.com/shubhamsoni24)
