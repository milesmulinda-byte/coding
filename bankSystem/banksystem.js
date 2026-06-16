// ============================================================
//  BANK SYSTEM — browser JavaScript
// ============================================================

const accounts = [];

// ── BANK ACCOUNT CLASS ───────────────────────────────────────
class BankAccount {
  constructor(accountNumber, accountHolder, balance) {
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this.balance       = balance;
  }

  displayAccountInfo() {
    return `#${this.accountNumber} | ${this.accountHolder} | $${this.balance.toFixed(2)}`;
  }

  withdraw(amount) {
    if (amount <= 0)            return { ok: false, msg: "Amount must be greater than zero." };
    if (amount > this.balance)  return { ok: false, msg: "Insufficient funds." };
    this.balance -= amount;
    return { ok: true,  msg: `Withdrawal successful. New balance: $${this.balance.toFixed(2)}` };
  }

  deposit(amount) {
    if (amount <= 0) return { ok: false, msg: "Amount must be greater than zero." };
    this.balance += amount;
    return { ok: true, msg: `Deposit successful. New balance: $${this.balance.toFixed(2)}` };
  }

  transfer(amount, targetAccount) {
    if (amount <= 0)           return { ok: false, msg: "Amount must be greater than zero." };
    if (amount > this.balance) return { ok: false, msg: "Insufficient funds." };
    this.balance          -= amount;
    targetAccount.balance += amount;
    return {
      ok:  true,
      msg: `Transfer successful to ${targetAccount.accountHolder}. Your new balance: $${this.balance.toFixed(2)}`
    };
  }
}

// ── HELPER FUNCTIONS ─────────────────────────────────────────
function findAccountByNumber(number) {
  return accounts.find(a => a.accountNumber === number) || null;
}

function calculateTotalBalance() {
  return accounts.reduce((sum, a) => sum + a.balance, 0);
}

function findRichestAccount() {
  if (accounts.length === 0) return null;
  return accounts.reduce((max, a) => (a.balance > max.balance ? a : max), accounts[0]);
}

// ── STATE FOR THE DETAIL SHEET ────────────────────────────────
let activeAccountNumber = null;   // which account is open in the sheet
let balanceVisible      = false;  // is the balance shown or masked?
let activeSheetForm     = null;   // "deposit" | "withdraw" | "transfer" | null

// ── UI HELPERS ───────────────────────────────────────────────
function showMessage(id, text, isOk) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className   = "message " + (isOk ? "success" : "error");
}

function clearMessage(id) {
  const el = document.getElementById(id);
  el.textContent = "";
  el.className   = "message";
}

function updateSummary() {
  document.getElementById("total-balance").textContent =
    "$" + calculateTotalBalance().toFixed(2);
  document.getElementById("total-accounts").textContent =
    accounts.length;
}

function renderAccounts() {
  const list = document.getElementById("accounts-list");

  if (accounts.length === 0) {
    list.innerHTML = '<p class="empty-msg">No accounts yet. Create one to get started.</p>';
    return;
  }

  list.innerHTML = accounts.map(a => {
    const initials = a.accountHolder
      .split(" ")
      .map(w => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    return `
      <div class="account-row" onclick="openDetail(${a.accountNumber})">
        <div class="account-avatar">${initials}</div>
        <div>
          <div class="account-name">${a.accountHolder}</div>
          <div class="account-number">#${a.accountNumber}</div>
        </div>
        <div class="account-balance-masked">••••••</div>
        <div class="account-chevron">›</div>
      </div>`;
  }).join("");
}

function switchTab(name) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById("panel-" + name).classList.add("active");
  document.querySelectorAll(".tab").forEach(t => {
    if (t.getAttribute("onclick").includes("'" + name + "'")) {
      t.classList.add("active");
    }
  });
}

// ── DETAIL SHEET ─────────────────────────────────────────────

/**
 * openDetail(accountNumber)
 * Opens the bottom sheet for the given account.
 */
function openDetail(accountNumber) {
  const account = findAccountByNumber(accountNumber);
  if (!account) return;

  activeAccountNumber = accountNumber;
  balanceVisible      = false;   // always start masked
  activeSheetForm     = null;

  // Populate header
  document.getElementById("detail-holder-name").textContent = account.accountHolder;
  document.getElementById("detail-account-num").textContent = "#" + account.accountNumber;

  // Set masked balance
  const amountEl = document.getElementById("detail-balance-amount");
  amountEl.textContent = "••••••";
  amountEl.className   = "detail-balance-amount masked";
  document.getElementById("eye-btn").textContent = "👁";

  // Hide any open inline form
  document.querySelectorAll(".sheet-form").forEach(f => f.classList.remove("open"));

  // Clear any old messages
  ["s-dep-msg", "s-with-msg", "s-trf-msg"].forEach(id => clearMessage(id));

  // Pre-fill "from" account number in transfer form
  document.getElementById("s-trf-from").value = accountNumber;

  // Show the overlay
  document.getElementById("detail-overlay").classList.add("open");
  document.body.style.overflow = "hidden"; // prevent background scroll
}

/**
 * closeDetail()
 * Closes the bottom sheet.
 */
function closeDetail() {
  document.getElementById("detail-overlay").classList.remove("open");
  document.body.style.overflow = "";
  activeAccountNumber = null;
  activeSheetForm     = null;
}

/**
 * toggleBalance()
 * Toggles whether the balance is shown or masked inside the sheet.
 */
function toggleBalance() {
  const account = findAccountByNumber(activeAccountNumber);
  if (!account) return;

  balanceVisible = !balanceVisible;
  const amountEl = document.getElementById("detail-balance-amount");

  if (balanceVisible) {
    amountEl.textContent = "$" + account.balance.toFixed(2);
    amountEl.className   = "detail-balance-amount";
    document.getElementById("eye-btn").textContent = "🙈";
  } else {
    amountEl.textContent = "••••••";
    amountEl.className   = "detail-balance-amount masked";
    document.getElementById("eye-btn").textContent = "👁";
  }
}

/**
 * showSheetForm(name)
 * Shows one of the three inline forms (deposit / withdraw / transfer)
 * and hides the others.  Clicking the same button again hides it.
 */
function showSheetForm(name) {
  if (activeSheetForm === name) {
    // toggle off
    document.getElementById("sheet-" + name).classList.remove("open");
    activeSheetForm = null;
    return;
  }

  // Hide all forms first
  document.querySelectorAll(".sheet-form").forEach(f => f.classList.remove("open"));

  // Show the chosen one
  document.getElementById("sheet-" + name).classList.add("open");
  activeSheetForm = name;

  // Clear any stale messages
  ["s-dep-msg", "s-with-msg", "s-trf-msg"].forEach(id => clearMessage(id));
}

// ── ACTION FUNCTIONS (sheet versions) ────────────────────────

function sheetDeposit() {
  clearMessage("s-dep-msg");
  const amount  = parseFloat(document.getElementById("s-dep-amt").value);
  const account = findAccountByNumber(activeAccountNumber);
  if (!account) return;
  if (isNaN(amount)) { showMessage("s-dep-msg", "Please enter a valid amount.", false); return; }

  const result = account.deposit(amount);
  showMessage("s-dep-msg", result.msg, result.ok);

  if (result.ok) {
    document.getElementById("s-dep-amt").value = "";
    refreshSheetBalance();
    renderAccounts();
    updateSummary();
  }
}

function sheetWithdraw() {
  clearMessage("s-with-msg");
  const amount  = parseFloat(document.getElementById("s-with-amt").value);
  const account = findAccountByNumber(activeAccountNumber);
  if (!account) return;
  if (isNaN(amount)) { showMessage("s-with-msg", "Please enter a valid amount.", false); return; }

  const result = account.withdraw(amount);
  showMessage("s-with-msg", result.msg, result.ok);

  if (result.ok) {
    document.getElementById("s-with-amt").value = "";
    refreshSheetBalance();
    renderAccounts();
    updateSummary();
  }
}

function sheetTransfer() {
  clearMessage("s-trf-msg");
  const toNumber = parseInt(document.getElementById("s-trf-to").value);
  const amount   = parseFloat(document.getElementById("s-trf-amt").value);

  const fromAccount = findAccountByNumber(activeAccountNumber);
  const toAccount   = findAccountByNumber(toNumber);

  if (!fromAccount)  { showMessage("s-trf-msg", "Source account not found.", false); return; }
  if (!toAccount)    { showMessage("s-trf-msg", "Destination account not found.", false); return; }
  if (activeAccountNumber === toNumber) { showMessage("s-trf-msg", "Cannot transfer to the same account.", false); return; }
  if (isNaN(amount)) { showMessage("s-trf-msg", "Please enter a valid amount.", false); return; }

  const result = fromAccount.transfer(amount, toAccount);
  showMessage("s-trf-msg", result.msg, result.ok);

  if (result.ok) {
    document.getElementById("s-trf-to").value  = "";
    document.getElementById("s-trf-amt").value = "";
    refreshSheetBalance();
    renderAccounts();
    updateSummary();
  }
}

/**
 * refreshSheetBalance()
 * After a transaction, updates the balance shown in the open sheet
 * (respecting the current masked / visible state).
 */
function refreshSheetBalance() {
  const account = findAccountByNumber(activeAccountNumber);
  if (!account) return;
  const amountEl = document.getElementById("detail-balance-amount");
  if (balanceVisible) {
    amountEl.textContent = "$" + account.balance.toFixed(2);
  }
  // If masked, nothing to update visually
}

// ── CREATE ACCOUNT ────────────────────────────────────────────
function createAccount() {
  clearMessage("c-msg");

  const number  = parseInt(document.getElementById("c-num").value);
  const holder  = document.getElementById("c-name").value.trim();
  const balance = parseFloat(document.getElementById("c-bal").value);

  if (!number || !holder || isNaN(balance)) {
    showMessage("c-msg", "Please fill in all fields.", false);
    return;
  }
  if (balance < 0) {
    showMessage("c-msg", "Initial balance cannot be negative.", false);
    return;
  }
  if (findAccountByNumber(number)) {
    showMessage("c-msg", `Account #${number} already exists.`, false);
    return;
  }

  const account = new BankAccount(number, holder, balance);
  accounts.push(account);

  showMessage("c-msg", `Account created for ${holder}!`, true);

  document.getElementById("c-num").value  = "";
  document.getElementById("c-name").value = "";
  document.getElementById("c-bal").value  = "";

  renderAccounts();
  updateSummary();
}

// ── CLOSE ACCOUNT ─────────────────────────────────────────────
function closeAccount() {
  const index = accounts.findIndex(a => a.accountNumber === activeAccountNumber);
  if (index === -1) return;
  accounts.splice(index, 1);
  closeDetail();
  renderAccounts();
  updateSummary();
  switchTab("accounts");
}

// ── CLOSE SHEET WHEN CLICKING BACKDROP ───────────────────────
document.getElementById("detail-overlay").addEventListener("click", function(e) {
  if (e.target === this) closeDetail();
});