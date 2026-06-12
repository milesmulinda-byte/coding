const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper to promisify rl.question
// const ask = (question) =>
//   new Promise((resolve) => rl.question(question, resolve));

class BankAccount {
  constructor(accountNumber, accountHolder, balance) {
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this.balance = balance;
  }

  displayAccountInfo() {
    console.log(`\nAccount Number: ${this.accountNumber}`);
    console.log(`Account Holder: ${this.accountHolder}`);
    console.log(`Balance: $${this.balance.toFixed(2)}\n`);
  }

  withdraw(amount) {
    if (amount > this.balance) {
      console.log("Insufficient funds.\n");
    } else {
      this.balance -= amount;
      console.log(`Withdrawal successful. New balance: $${this.balance.toFixed(2)}\n`);
    }
  }

  deposit(amount) {
    this.balance += amount;
    console.log(`Deposit successful. New balance: $${this.balance.toFixed(2)}\n`);
  }

  transfer(amount, targetAccount) {
    if (amount > this.balance) {
      console.log("Insufficient funds.\n");
    } else {
      this.balance -= amount;
      targetAccount.balance += amount;
      console.log(
        `Transfer successful to ${targetAccount.accountHolder}. New balance: $${this.balance.toFixed(2)}\n`
      );
    }
  }
}

const accounts = [];

function findAccountByNumber(number) {
  return accounts.find((a) => a.accountNumber === number) || null;
}

// async function createAccount() {
//   const number = parseInt(await ask("Enter account number: "));
//   const holder = await ask("Enter account holder name: ");
//   const balance = parseFloat(await ask("Enter initial balance: "));
//   const account = new BankAccount(number, holder, balance);
//   accounts.push(account);
//   console.log(`\nAccount created successfully for ${holder}.\n`);
// }

function viewAccounts() {
  if (accounts.length === 0) {
    console.log("\nNo accounts found.\n");
    return;
  }
  console.log("\nAll accounts:");
  accounts.forEach((a) => {
    console.log(
      `  #${a.accountNumber} | ${a.accountHolder} | $${a.balance.toFixed(2)}`
    );
  });
  console.log();
}

function calculateTotalBalance() {
  return accounts.reduce((sum, a) => sum + a.balance, 0);
}

function findRichestAccount() {
  return accounts.reduce((max, a) => (a.balance > max.balance ? a : max), accounts[0]);
}

// async function closeAccount() {
//   const number = parseInt(await ask("Enter account number to close: "));
//   const index = accounts.findIndex((a) => a.accountNumber === number);
//   if (index === -1) {
//     console.log("Account not found.\n");
//   } else {
//     const removed = accounts.splice(index, 1)[0];
//     console.log(`Account of ${removed.accountHolder} closed successfully.\n`);
//   }
// }

async function main() {
  console.log("\n--- Welcome to the Bank ---\n");

  while (true) {
    console.log(
      "1. Create account\n" +
      "2. Display account info\n" +
      "3. Withdraw\n" +
      "4. Deposit\n" +
      "5. Transfer\n" +
      "6. View all accounts\n" +
      "7. Close account\n" +
      "8. Total balance of all accounts\n" +
      "9. Find richest account\n" +
      "10. Exit"
    );

    const option = parseInt(await ask("Choose an option: "));

    if (option === 1) {
      await createAccount();

    } else if (option === 2) {
      // const number = parseInt(await ask("Enter account number: "));
      // const account = findAccountByNumber(number);
      // if (account) account.displayAccountInfo();
      // else console.log("Account not found.\n");

    } else if (option === 3) {
      const number = parseInt(await ask("Enter account number: "));
      const account = findAccountByNumber(number);
      if (account) {
        const amount = parseFloat(await ask("Enter amount to withdraw: "));
        account.withdraw(amount);
      } else console.log("Account not found.\n");

    } else if (option === 4) {
      const number = parseInt(await ask("Enter account number: "));
      const account = findAccountByNumber(number);
      if (account) {
        const amount = parseFloat(await ask("Enter amount to deposit: "));
        account.deposit(amount);
      } else console.log("Account not found.\n");

    } else if (option === 5) {
      const fromNumber = parseInt(await ask("Enter your account number: "));
      const fromAccount = findAccountByNumber(fromNumber);
      if (!fromAccount) { console.log("Account not found.\n"); continue; }
      const toNumber = parseInt(await ask("Enter target account number: "));
      const toAccount = findAccountByNumber(toNumber);
      if (!toAccount) { console.log("Target account not found.\n"); continue; }
      const amount = parseFloat(await ask("Enter amount to transfer: "));
      fromAccount.transfer(amount, toAccount);

    } else if (option === 6) {
      viewAccounts();

    } else if (option === 7) {
      await closeAccount();

    } else if (option === 8) {
      const total = calculateTotalBalance();
      console.log(`\nTotal balance across all accounts: $${total.toFixed(2)}\n`);

    } else if (option === 9) {
      if (accounts.length === 0) {
        console.log("\nNo accounts found.\n");
      } else {
        const richest = findRichestAccount();
        console.log(`\nRichest account: #${richest.accountNumber} | ${richest.accountHolder} | $${richest.balance.toFixed(2)}\n`);
      }

    } else if (option === 10) {
      console.log("Goodbye!");
      rl.close();
      break;

    } else {
      console.log("Invalid option. Please try again.\n");
    }
  }
}

main();