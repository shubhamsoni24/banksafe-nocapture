// ── BankSafe NoCapture Options ──

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

let userKeywords = [];

// ── DOM refs ──
const builtinTags = document.getElementById("builtinTags");
const builtinCount = document.getElementById("builtinCount");
const customTags = document.getElementById("customTags");
const customCount = document.getElementById("customCount");
const keywordInput = document.getElementById("keywordInput");
const addBtn = document.getElementById("addBtn");
const emptyMsg = document.getElementById("emptyMsg");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const resetBtn = document.getElementById("resetBtn");
const importExportArea = document.getElementById("importExportArea");
const importConfirmBtn = document.getElementById("importConfirmBtn");
const toast = document.getElementById("toast");

// ── Toast ──
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// ── Render built-in tags ──
function renderBuiltinTags() {
  builtinTags.innerHTML = "";
  builtinCount.textContent = DEFAULT_BANK_KEYWORDS.length;
  for (const kw of DEFAULT_BANK_KEYWORDS) {
    const tag = document.createElement("span");
    tag.className = "tag builtin";
    tag.textContent = kw;
    builtinTags.appendChild(tag);
  }
}

// ── Render custom tags ──
function renderCustomTags() {
  customTags.innerHTML = "";
  customCount.textContent = userKeywords.length;

  if (userKeywords.length === 0) {
    const p = document.createElement("p");
    p.className = "empty-msg";
    p.textContent = "No custom keywords added yet.";
    customTags.appendChild(p);
    return;
  }

  for (const kw of userKeywords) {
    const tag = document.createElement("span");
    tag.className = "tag";

    const text = document.createTextNode(kw + " ");
    tag.appendChild(text);

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "×";
    removeBtn.title = `Remove "${kw}"`;
    removeBtn.addEventListener("click", () => removeKeyword(kw));
    tag.appendChild(removeBtn);

    customTags.appendChild(tag);
  }
}

// ── Add keyword ──
async function addKeyword(raw) {
  const keyword = raw.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!keyword) return;

  if (DEFAULT_BANK_KEYWORDS.includes(keyword)) {
    showToast(`"${keyword}" is already a built-in keyword`);
    return;
  }
  if (userKeywords.includes(keyword)) {
    showToast(`"${keyword}" already added`);
    return;
  }

  userKeywords.push(keyword);
  userKeywords.sort();
  await chrome.storage.local.set({ userKeywords });
  renderCustomTags();
  showToast(`Added "${keyword}"`);
}

// ── Remove keyword ──
async function removeKeyword(keyword) {
  userKeywords = userKeywords.filter((k) => k !== keyword);
  await chrome.storage.local.set({ userKeywords });
  renderCustomTags();
  showToast(`Removed "${keyword}"`);
}

// ── Event listeners ──
addBtn.addEventListener("click", () => {
  addKeyword(keywordInput.value);
  keywordInput.value = "";
  keywordInput.focus();
});

keywordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addKeyword(keywordInput.value);
    keywordInput.value = "";
  }
});

exportBtn.addEventListener("click", () => {
  const json = JSON.stringify(userKeywords, null, 2);
  navigator.clipboard.writeText(json).then(() => {
    showToast("Keywords copied to clipboard!");
  }).catch(() => {
    importExportArea.style.display = "block";
    importExportArea.value = json;
    importExportArea.select();
    showToast("Keywords shown below — copy manually");
  });
});

importBtn.addEventListener("click", () => {
  importExportArea.style.display = "block";
  importConfirmBtn.style.display = "inline-block";
  importExportArea.value = "";
  importExportArea.placeholder = 'Paste JSON array here, e.g. ["paypal", "venmo"]';
  importExportArea.focus();
});

importConfirmBtn.addEventListener("click", async () => {
  try {
    const parsed = JSON.parse(importExportArea.value);
    if (!Array.isArray(parsed)) throw new Error("Not an array");
    const cleaned = parsed
      .map((k) => String(k).trim().toLowerCase().replace(/[^a-z0-9]/g, ""))
      .filter((k) => k && !DEFAULT_BANK_KEYWORDS.includes(k));
    const merged = [...new Set([...userKeywords, ...cleaned])].sort();
    userKeywords = merged;
    await chrome.storage.local.set({ userKeywords });
    renderCustomTags();
    importExportArea.style.display = "none";
    importConfirmBtn.style.display = "none";
    showToast(`Imported ${cleaned.length} keywords`);
  } catch {
    showToast("Invalid JSON — use an array of strings");
  }
});

resetBtn.addEventListener("click", async () => {
  if (!confirm("Remove all custom keywords? Built-in keywords will remain.")) return;
  userKeywords = [];
  await chrome.storage.local.set({ userKeywords });
  renderCustomTags();
  importExportArea.style.display = "none";
  importConfirmBtn.style.display = "none";
  showToast("All custom keywords removed");
});

// ── Init ──
async function init() {
  renderBuiltinTags();
  const data = await chrome.storage.local.get(["userKeywords"]);
  userKeywords = data.userKeywords || [];
  renderCustomTags();
}

document.addEventListener("DOMContentLoaded", init);
