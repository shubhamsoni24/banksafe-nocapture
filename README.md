# 🛡️ BankSafe NoCapture

A lightweight Chrome extension (Manifest V3) that warns you to **stop screen recording or screen capture** whenever you open a banking website.

When you open or switch to a tab whose link is a banking site, a persistent Chrome notification appears:

> **Screen capture alert**
> You opened a banking site (www.sbicard.com). Stop any screen recording or screen capture now.

Non-banking sites never trigger anything.

---

## ✨ Features

- 🏦 Detects **all scheduled banks in India** — sourced from the official [RBI "Banks in India" directory](https://www.rbi.org.in/commonman/english/scripts/banksinindia.aspx)
- 💳 Catches card portals too (`*.sbicard.com`, etc.) — every subdomain included
- 🔕 One alert per URL per tab — no spam while you scroll or switch away and back
- ⏸️ Notification **stays on screen** until dismissed (with sound)
- 🟢 **Toolbar badge** — green when on a banking site, grey when disabled
- 🎛️ **Popup** — toggle protection on/off, see current site status & alert count
- ⚙️ **Options page** — add/remove custom bank keywords without editing code
- 📋 **Import/Export** — backup and share your custom keyword list as JSON
- 🔒 100% private — works completely offline, stores nothing externally
- ⚡ Tiny, zero dependencies, no UI clutter

## 🧠 How detection works

`background.js` listens for tab opens, navigations, and tab switches, then checks the tab's hostname against three rules, in order:

| Rule | Matches | Examples |
|------|---------|----------|
| 1. Contains `bank` | Any domain with "bank" in it | `hdfcbank.com`, `pnb.bank.in`, `bankofbaroda.in`, `netbanking.*` |
| 2. Contains `card` | Any domain with "card" in it | `www.sbicard.com`, `secure.sbicard.com` |
| 3. Keyword list | Built-in + custom bank domains | `sbi.co.in`, `kotak.com`, `indusind.com`, `chase.com` |

Keyword matching runs on **hostname label boundaries**, so `iob.in` triggers but lookalikes like `ioby.org` don't.

### Coverage

- **12 public-sector banks** — SBI, PNB, Bank of Baroda, Canara, Union, Indian Bank...
- **21 private-sector banks** — HDFC Bank, ICICI, Axis, Kotak, IndusInd, IDFC FIRST, Yes Bank...
- **Small finance & payments banks** — AU, Equitas, Ujjivan, IPPB, Airtel Payments Bank...
- **All 28 regional rural banks**
- **Foreign banks operating in India** — Citi, HSBC, Standard Chartered, Deutsche, Amex...
- **+ any custom keywords** you add through the options page

> 💡 RBI is migrating Indian banks to `.bank.in` domains (`sbi.bank.in`, `axis.bank.in`, ...). Those are caught automatically by Rule 1 — keywords only matter for legacy domains like `kotak.com`.

## 📥 Install

1. **Download**: click **Code → Download ZIP**, then extract it
2. Open `chrome://extensions` in Chrome (works in Edge/Brave too via their extensions page)
3. Enable **Developer mode** (toggle, top-right)
4. Click **Load unpacked** and select the extracted folder
5. Done! Test by opening any banking site

## ⚙️ Customize

### From the popup
Click the 🛡️ toolbar icon to:
- **Toggle protection** on/off
- See if the current tab is a banking site
- Check how many alerts have been triggered

### From the options page
Right-click the toolbar icon → **Options**, or click ⚙️ in the popup:
- **Add custom keywords** — type a domain keyword and press Enter
- **Remove keywords** — click the × on any custom tag
- **Import/Export** — share keywords as JSON
- **Reset** — remove all custom keywords (built-in list stays)

### From the code
Edit `background.js`, then hit the ↻ reload icon on the extension card at `chrome://extensions`.

## 🔒 Privacy & Security

| Question | Answer |
|----------|--------|
| Does it read page content? | ❌ Never — no content scripts |
| Where does my browsing data go? | ❌ Nowhere — zero network calls in the entire codebase |
| What is stored? | Only your toggle state and custom keywords (locally) |
| Why the `tabs` permission? | Required to read tab URLs for matching. It cannot modify pages |

## ⚠️ Limitations

This is a **reminder, not a security control**. It won't trigger for:

- URLs opened by IP address instead of domain name
- Shortener redirects that resolve *after* the check
- Banking content embedded in another site's iframe

## 📁 Project structure

```
banksafe-nocapture/
├── manifest.json    # Extension config (MV3, permissions)
├── background.js    # Detection rules + notification + badge logic
├── popup.html       # Extension popup UI
├── popup.js         # Popup logic (status, toggle, stats)
├── popup.css        # Popup styles (dark theme)
├── options.html     # Settings page UI
├── options.js       # Settings logic (keyword CRUD, import/export)
├── options.css      # Settings styles
├── icon128.png      # Toolbar/notification icon
├── index.html       # Landing page (for Vercel)
├── .gitignore
├── LICENSE
└── README.md
```

## 🌐 Website

Visit the landing page: [banksafe-nocapture.vercel.app](https://banksafe-nocapture.vercel.app)

## 🤝 Contributing

Found a bank domain that isn't detected? Please open an issue or PR — just add one line to `BANK_KEYWORDS` in `background.js` or use the options page.

## 📄 License

[MIT](LICENSE)
