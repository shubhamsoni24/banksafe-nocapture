const BANK_KEYWORDS = [
  "sbi",
  "onlinesbi",
  "sbicollect",
  "pnbindia",
  "iob",
  "kotak",
  "kotak811",
  "indusind",
  "idbi",
  "csb",
  "cub",
  "kvb",
  "tmb",
  "aubank",
  "ujjivan",
  "equitas",
  "ippbonline",
  "nsdlpayments",
  "jiopaymentsbank",
  "bobfinancial",
  "americanexpress",
  "amex",
  "chase",
  "bankofamerica",
  "wellsfargo",
  "citibank",
  "citi",
  "usbank",
  "capitalone",
  "pnc",
  "truist",
  "hsbc",
  "barclays",
  "lloyds",
  "natwest",
  "santander",
  "halifax",
  "standardchartered",
  "maybank",
  "dbs",
  "ocbc",
  "posb",
  "uob",
  "emiratesnbd",
  "rakbank",
  "deutsche",
  "firstrand",
  "icbc",
  "mashreq",
  "shinhan",
  "mizuho",
  "smbc",
  "mufg",
  "kookmin",
  "woori",
  "nonghyup",
  "qnb",
];

const notified = new Map();

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
  for (const keyword of BANK_KEYWORDS) {
    if (hostMatchesKeyword(host, keyword)) return host;
  }
  return null;
}

async function evaluateTab(tabId) {
  let tab;
  try {
    tab = await chrome.tabs.get(tabId);
  } catch {
    notified.delete(tabId);
    return;
  }
  const url = tab.url || "";
  if (!/^https?:\/\//i.test(url)) return;

  const matched = matchBank(url);
  if (!matched) {
    notified.delete(tabId);
    return;
  }
  if (notified.get(tabId) === url) return;

  notified.set(tabId, url);
  chrome.notifications.create(`capture-alert-${tabId}-${Date.now()}`, {
    type: "basic",
    iconUrl: "icon128.png",
    title: "Screen capture alert",
    message: `You opened a banking site (${matched}). Stop any screen recording or screen capture now.`,
    priority: 2,
    requireInteraction: true,
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url || changeInfo.status === "complete") evaluateTab(tabId);
});

chrome.tabs.onActivated.addListener(({ tabId }) => evaluateTab(tabId));

chrome.tabs.onRemoved.addListener((tabId) => notified.delete(tabId));
