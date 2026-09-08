// ── BankSafe NoCapture — Background Service Worker ──

const DEFAULT_BANK_KEYWORDS = [
  "sbi","onlinesbi","sbicollect","pnbindia","iob","kotak","kotak811",
  "indusind","idbi","csb","cub","kvb","tmb","aubank","ujjivan","equitas",
  "ippbonline","nsdlpayments","jiopaymentsbank","bobfinancial",
  "americanexpress","amex","chase","bankofamerica","wellsfargo","citibank",
  "citi","usbank","capitalone","pnc","truist","hsbc","barclays","lloyds",
  "natwest","santander","halifax","standardchartered","maybank","dbs",
  "ocbc","posb","uob","emiratesnbd","rakbank","deutsche","firstrand",
  "icbc","mashreq","shinhan","mizuho","smbc","mufg","kookmin","woori",
  "nonghyup","qnb",
];

const notified = new Map();
let userKeywords = [];
let extensionEnabled = true;

// ── Load settings from storage ──
async function loadSettings() {
  const data = await chrome.storage.local.get(["enabled", "userKeywords"]);
  extensionEnabled = data.enabled !== false;
  userKeywords = data.userKeywords || [];
}

loadSettings();

// React to storage changes (popup toggle, options keyword edits)
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) extensionEnabled = changes.enabled.newValue !== false;
  if (changes.userKeywords) userKeywords = changes.userKeywords.newValue || [];
});

// ── Matching logic ──
function hostMatchesKeyword(host, keyword) {
  return (
    host === keyword ||
    host.startsWith(keyword + ".") ||
    host.endsWith("." + keyword) ||
    host.includes("." + keyword + ".")
  );
}

function matchBank(url) {
  let host;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
  if (host.includes("bank") || host.includes("card")) return host;
  const allKeywords = [...DEFAULT_BANK_KEYWORDS, ...userKeywords];
  for (const keyword of allKeywords) {
    if (hostMatchesKeyword(host, keyword)) return host;
  }
  return null;
}

// ── Badge management ──
async function updateBadge(tabId, isBanking) {
  if (!extensionEnabled) {
    await chrome.action.setBadgeText({ text: "OFF", tabId });
    await chrome.action.setBadgeBackgroundColor({ color: "#555555", tabId });
    return;
  }
  if (isBanking) {
    await chrome.action.setBadgeText({ text: "ON", tabId });
    await chrome.action.setBadgeBackgroundColor({ color: "#00d26a", tabId });
  } else {
    await chrome.action.setBadgeText({ text: "", tabId });
  }
}

// ── Increment alert counter ──
async function incrementAlertCount() {
  const data = await chrome.storage.local.get(["alertCount"]);
  const count = (data.alertCount || 0) + 1;
  await chrome.storage.local.set({ alertCount: count });
}

// ── Core evaluation ──
async function evaluateTab(tabId) {
  let tab;
  try {
    tab = await chrome.tabs.get(tabId);
  } catch {
    notified.delete(tabId);
    return;
  }
  const url = tab.url || "";
  if (!/^https?:\/\//i.test(url)) {
    await updateBadge(tabId, false);
    return;
  }

  const matched = matchBank(url);

  if (!matched) {
    notified.delete(tabId);
    await updateBadge(tabId, false);
    return;
  }

  // Always update badge for banking sites
  await updateBadge(tabId, true);

  // Skip notification if disabled or already notified for this URL
  if (!extensionEnabled) return;
  if (notified.get(tabId) === url) return;

  notified.set(tabId, url);
  await incrementAlertCount();

  chrome.notifications.create(`banksafe-nocapture-${tabId}-${Date.now()}`, {
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: "⚠️ Banking site detected",
    message: "A banking or financial site is open. Please ensure all screen recording and screen capture tools are turned off before you proceed.",
    priority: 2,
    requireInteraction: true,
  });
}

// ── Listeners ──
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url || changeInfo.status === "complete") evaluateTab(tabId);
});

chrome.tabs.onActivated.addListener(({ tabId }) => evaluateTab(tabId));

chrome.tabs.onRemoved.addListener((tabId) => notified.delete(tabId));
