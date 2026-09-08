# 🔔 Capture Alert

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
- 🔒 100% private — works completely offline, stores nothing, sends nothing anywhere
- ⚡ Tiny (~1 KB of code), zero dependencies, no UI clutter

## 🧠 How detection works

`background.js` listens for tab opens, navigations, and tab switches, then checks the tab's hostname against three rules, in order:

| Rule | Matches | Examples |
|------|---------|----------|
| 1. Contains `bank` | Any domain with "bank" in it | `hdfcbank.com`, `pnb.bank.in`, `bankofbaroda.in`, `netbanking.*` |
| 2. Contains `card` | Any domain with "card" in it | `www.sbicard.com`, `secure.sbicard.com` |
| 3. Keyword list | Known bank domains without "bank"/"card" | `sbi.co.in`, `kotak.com`, `indusind.com`, `chase.com` |

Keyword matching runs on **hostname label boundaries**, so `iob.in` triggers but lookalikes like `ioby.org` don't.

### Coverage

- **12 public-sector banks** — SBI, PNB, Bank of Baroda, Canara, Union, Indian Bank...
- **21 private-sector banks** — HDFC Bank, ICICI, Axis, Kotak, IndusInd, IDFC FIRST, Yes Bank...
- **Small finance & payments banks** — AU, Equitas, Ujjivan, IPPB, Airtel Payments Bank...
- **All 28 regional rural banks**
- **Foreign banks operating in India** — Citi, HSBC, Standard Chartered, Deutsche, Amex...

> 💡 RBI is migrating Indian banks to `.bank.in` domains (`sbi.bank.in`, `axis.bank.in`, ...). Those are caught automatically by Rule 1 — keywords only matter for legacy domains like `kotak.com`.

## 📥 Install

1. **Download**: click **Code → Download ZIP**, then extract it
2. Open `chrome://extensions` in Chrome (works in Edge/Brave too via their extensions page)
3. Enable **Developer mode** (toggle, top-right)
4. Click **Load unpacked** and select the extracted folder
5. Done! Test by opening any banking site

## ⚙️ Customize

Edit `background.js`, then hit the ↻ reload icon on the extension card at `chrome://extensions`.

**Add your bank** — append the identifying part of its domain to `BANK_KEYWORDS`:

```js
const BANK_KEYWORDS = [
  // ...existing entries...
  "mybankname",   // matches mybankname.com, portal.mybankname.com, ...
];
```

**Alert on every website** — replace the first line of `matchBank()`:

```js
if (host) return host;
```

**Remove the broad `card` rule** (stops greeting-card shops from triggering) — change Rule 2 back to bank-only:

```js
if (host.includes("bank")) return host;
```

## 🔒 Privacy & Security

| Question | Answer |
|----------|--------|
| Does it read page content? | ❌ Never — no content scripts |
| Where does my browsing data go? | ❌ Nowhere — zero network calls in the entire codebase |
| What is stored? | ❌ Nothing — no storage permissions at all |
| Why the `tabs` permission? | Required to read tab URLs for matching. It cannot modify pages |

## ⚠️ Limitations

This is a **reminder, not a security control**. It won't trigger for:

- URLs opened by IP address instead of domain name
- Shortener redirects that resolve *after* the check
- Banking content embedded in another site's iframe

## 📁 Project structure

```
capture-alert/
├── manifest.json    # Extension config (MV3, permissions)
├── background.js    # Detection rules + notification logic
├── icon128.png      # Toolbar/notification icon
└── README.md
```

## 🤝 Contributing

Found a bank domain that isn't detected? Please open an issue or PR — just add one line to `BANK_KEYWORDS`.

## 📄 License

[MIT](LICENSE)
