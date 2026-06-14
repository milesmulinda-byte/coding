// ============================================================
//  BANK SYSTEM — browser JavaScript
//
//  Your original code used Node.js's "readline" module, which
//  only works in a terminal.  Browsers don't have that module,
//  so we can't use it here.
//
//  Everything below keeps your original CLASS and LOGIC intact:
//    • BankAccount class          ← unchanged
//    • findAccountByNumber()      ← unchanged
//    • calculateTotalBalance()    ← unchanged
//    • findRichestAccount()       ← unchanged
//
//  What's NEW is a set of small UI functions that read values
//  from the HTML inputs and call your existing methods.
// ============================================================


// ── DATA STORE ───────────────────────────────────────────────
// Same array you had before — holds all BankAccount objects.
const accounts = [];


// ── BANK ACCOUNT CLASS ───────────────────────────────────────
// Identical to your original class.  The only difference:
// instead of console.log() we return result strings so the UI
// can display them in the coloured message boxes.
class BankAccount {
  constructor(accountNumber, accountHolder, balance) {
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this.balance       = balance;
  }

  // Returns a short text summary (used when building account rows)
  displayAccountInfo() {
    return `#${this.accountNumber} | ${this.accountHolder} | $${this.balance.toFixed(2)}`;
  }

  // Returns { ok: true/false, msg: "..." } so the caller knows what happened
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
// These three are identical to your originals.

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


// ── UI HELPERS ───────────────────────────────────────────────
// These are new — they update the page without reloading it.

/**
 * showMessage(id, text, isOk)
 * Finds the <div id="..."> message box and colours it green
 * (success) or red (error), then puts the text inside it.
 */
function showMessage(id, text, isOk) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className   = "message " + (isOk ? "success" : "error");
}

/**
 * clearMessage(id)
 * Clears a message box back to its empty, unstyled state.
 */
function clearMessage(id) {
  const el = document.getElementById(id);
  el.textContent = "";
  el.className   = "message";
}

/**
 * updateSummary()
 * Recalculates the two summary cards at the top of the page:
 *  • Total Balance  → sum of every account's balance
 *  • Total Accounts → how many accounts exist
 */
function updateSummary() {
  document.getElementById("total-balance").textContent =
    "$" + calculateTotalBalance().toFixed(2);
  document.getElementById("total-accounts").textContent =
    accounts.length;
}

/**
 * renderAccounts()
 * Rebuilds the "All Accounts" list from scratch every time
 * something changes (create, deposit, withdraw, transfer).
 *
 * For each account it creates one .account-row div that looks
 * like the rows you styled in bank.css.
 */
function renderAccounts() {
  const list = document.getElementById("accounts-list");

  // If there are no accounts, show the placeholder message
  if (accounts.length === 0) {
    list.innerHTML = '<p class="empty-msg">No accounts yet. Create one to get started.</p>';
    return;
  }

  // Build one row per account
  list.innerHTML = accounts.map(a => {
    // Avatar: first two letters of the holder's name (e.g. "AL" for Alice)
    const initials = a.accountHolder
      .split(" ")
      .map(w => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    return `
      <div class="account-row">
        <div class="account-avatar">${initials}</div>
        <div>
          <div class="account-name">${a.accountHolder}</div>
          <div class="account-number">#${a.accountNumber}</div>
        </div>
        <div class="account-balance">$${a.balance.toFixed(2)}</div>
        <button onclick="closeAccount(${a.accountNumber})" title="Close account"
          style="margin-left:8px; padding:4px 10px; font-size:0.8rem; color:#c62828; border-color:#c62828;">
          ✕
        </button>
      </div>`;
  }).join("");
}

/**
 * switchTab(name)
 * Shows one panel and hides all others.
 * Also marks the clicked tab button as "active".
 *
 * "name" must match the end of a panel id, e.g.
 *   name="create"  →  shows  id="panel-create"
 */
function switchTab(name) {
  // Hide every panel
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  // Deactivate every tab button
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));

  // Show the chosen panel
  document.getElementById("panel-" + name).classList.add("active");

  // Highlight the button whose onclick contains our tab name
  document.querySelectorAll(".tab").forEach(t => {
    if (t.getAttribute("onclick").includes("'" + name + "'")) {
      t.classList.add("active");
    }
  });
}


// ── ACTION FUNCTIONS ─────────────────────────────────────────
// These are called directly from onclick="" in the HTML.

/**
 * createAccount()
 * Reads the three inputs in the "Create Account" panel,
 * validates them, creates a new BankAccount, and adds it to
 * the accounts array.
 */
function createAccount() {
  clearMessage("c-msg");

  const number  = parseInt(document.getElementById("c-num").value);
  const holder  = document.getElementById("c-name").value.trim();
  const balance = parseFloat(document.getElementById("c-bal").value);

  // Validation
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

  // Create and store the account (same as your original createAccount)
  const account = new BankAccount(number, holder, balance);
  accounts.push(account);

  showMessage("c-msg", `Account created for ${holder}!`, true);

  // Clear the inputs ready for next use
  document.getElementById("c-num").value = "";
  document.getElementById("c-name").value = "";
  document.getElementById("c-bal").value = "";

  // Refresh the accounts list and summary cards
  renderAccounts();
  updateSummary();
}

/**
 * doDeposit()
 * Reads the account number and amount from the Deposit panel,
 * then calls account.deposit() — your original method.
 */
function doDeposit() {
  clearMessage("dw-msg");

  const number = parseInt(document.getElementById("dw-num").value);
  const amount = parseFloat(document.getElementById("dw-amt").value);
  const account = findAccountByNumber(number);

  if (!account) {
    showMessage("dw-msg", "Account not found.", false);
    return;
  }
  if (isNaN(amount)) {
    showMessage("dw-msg", "Please enter a valid amount.", false);
    return;
  }

  const result = account.deposit(amount);
  showMessage("dw-msg", result.msg, result.ok);

  if (result.ok) {
    renderAccounts();
    updateSummary();
  }
}

/**
 * doWithdraw()
 * Same idea as doDeposit but calls account.withdraw().
 */
function doWithdraw() {
  clearMessage("dw-msg");

  const number  = parseInt(document.getElementById("dw-num").value);
  const amount  = parseFloat(document.getElementById("dw-amt").value);
  const account = findAccountByNumber(number);

  if (!account) {
    showMessage("dw-msg", "Account not found.", false);
    return;
  }
  if (isNaN(amount)) {
    showMessage("dw-msg", "Please enter a valid amount.", false);
    return;
  }

  const result = account.withdraw(amount);
  showMessage("dw-msg", result.msg, result.ok);

  if (result.ok) {
    renderAccounts();
    updateSummary();
  }
}

/**
 * doTransfer()
 * Reads from/to account numbers and amount, then calls
 * fromAccount.transfer() — your original method.
 */
function doTransfer() {
  clearMessage("t-msg");

  const fromNumber = parseInt(document.getElementById("t-from").value);
  const toNumber   = parseInt(document.getElementById("t-to").value);
  const amount     = parseFloat(document.getElementById("t-amt").value);

  const fromAccount = findAccountByNumber(fromNumber);
  const toAccount   = findAccountByNumber(toNumber);

  if (!fromAccount) { showMessage("t-msg", "Source account not found.", false);      return; }
  if (!toAccount)   { showMessage("t-msg", "Destination account not found.", false); return; }
  if (fromNumber === toNumber) { showMessage("t-msg", "Cannot transfer to the same account.", false); return; }
  if (isNaN(amount)) { showMessage("t-msg", "Please enter a valid amount.", false);  return; }

  const result = fromAccount.transfer(amount, toAccount);
  showMessage("t-msg", result.msg, result.ok);

  if (result.ok) {
    renderAccounts();
    updateSummary();
  }
}

/**
 * closeAccount(number)
 * Removes an account from the array (same as your original
 * closeAccount function, now triggered by the ✕ button on
 * each account row).
 */
function closeAccount(number) {
  const index = accounts.findIndex(a => a.accountNumber === number);
  if (index === -1) return;

  const removed = accounts.splice(index, 1)[0];
  renderAccounts();
  updateSummary();

  // Switch to accounts tab so the user can see the updated list
  switchTab("accounts");
}