// ── BankSafe NoCapture Popup ──

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

function hostMatchesKeyword(host, keyword) {
  return (
    host === keyword ||
    host.startsWith(keyword + ".") ||
    host.endsWith("." + keyword) ||
    host.includes("." + keyword + ".")
  );
}

function matchBank(url, userKeywords = []) {
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

async function init() {
  const statusCard = document.getElementById("statusCard");
  const statusIcon = document.getElementById("statusIcon");
  const statusText = document.getElementById("statusText");
  const statusDetail = document.getElementById("statusDetail");
  const enableToggle = document.getElementById("enableToggle");
  const alertCount = document.getElementById("alertCount");
  const optionsLink = document.getElementById("optionsLink");

  // Load state from storage
  const data = await chrome.storage.local.get(["enabled", "alertCount", "userKeywords"]);
  const isEnabled = data.enabled !== false; // default true
  const count = data.alertCount || 0;
  const userKeywords = data.userKeywords || [];

  enableToggle.checked = isEnabled;
  alertCount.textContent = count;

  // Check current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url || "";

  if (!isEnabled) {
    statusCard.className = "status-card disabled";
    statusIcon.textContent = "⏸️";
    statusText.textContent = "Protection disabled";
    statusDetail.textContent = "Toggle on to resume monitoring";
  } else if (/^https?:\/\//i.test(url)) {
    const matched = matchBank(url, userKeywords);
    if (matched) {
      statusCard.className = "status-card warning";
      statusIcon.textContent = "⚠️";
      statusText.textContent = "Banking site detected";
      statusDetail.textContent = "Ensure screen recording is off";
    } else {
      statusCard.className = "status-card safe";
      statusIcon.textContent = "✅";
      statusText.textContent = "No banking site";
      statusDetail.textContent = "You're safe to record";
    }
  } else {
    statusCard.className = "status-card safe";
    statusIcon.textContent = "✅";
    statusText.textContent = "No banking site";
    statusDetail.textContent = "Non-web page";
  }

  // Toggle handler
  enableToggle.addEventListener("change", async () => {
    const enabled = enableToggle.checked;
    await chrome.storage.local.set({ enabled });

    if (!enabled) {
      statusCard.className = "status-card disabled";
      statusIcon.textContent = "⏸️";
      statusText.textContent = "Protection disabled";
      statusDetail.textContent = "Toggle on to resume monitoring";
    } else {
      // Re-evaluate on re-enable
      init();
    }
  });

  // Options link
  optionsLink.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
}

document.addEventListener("DOMContentLoaded", init);
