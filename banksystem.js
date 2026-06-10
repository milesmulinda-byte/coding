class BankAccount {
    constructor(accountNumber, accountHolder, balance) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = balance;
    }
    createAccount(accountNumber, accountHolder, balance) {
        const accountNumber = parseInt(prompt("Enter account number:"));
        const accountHolder = prompt("Enter account holder name:");
        const balance = parseFloat(prompt("Enter initial balance:"));
        return new BankAccount(accountNumber, accountHolder, balance);
        
    
    }
     displayAccountInfo() {
        console.log(`Account Number: ${this.accountNumber}`);
        console.log(`Account Holder: ${this.accountHolder}`);
        console.log(`Balance: ${this.balance}`);
    }
     withdraw(amount) {
        if (amount > this.balance) {
            console.log("Insufficient funds");
        }
            else { 
                this.balance -= amount;
                console.log(`Withdrawal successful. New balance: ${this.balance}`);

            }
        } deposit(amount) {
            this.balance += amount;
            console.log(`Deposit successful. New balance: ${this.balance}`);
        }
         transfer(id,amount, targetAccount) {
            if (amount > this.balance) {
                console.log("Insufficient funds");
            } else { 
                this.balance -= amount;
                targetAccount.balance += amount;
                console.log(`Transfer succesful to ${targetAccount.accountHolder}. New balance: ${this.balance}`);
            }
            }
         } async function main() {
            while (true) {
                const option = parseInt(prompt("Choose an option: 1. Create account, 2. Display account info, 3. Withdraw, 4. Deposit, 5. Transfer, 6. Exit"));
                if (option === 1) {
                    await ask createAccount();
                    
                } else if (option === 2) {
                    await  displayAccountInfo();
                } else if (option === 3) {
                    const amount = parseFloat(prompt("Enter amount to withdraw:"));
                    await withdraw(amount);
                } else if (option === 4) {
                    const amount = parseFloat(prompt("Enter amount to deposit:"));
                    await deposit(amount);
        
                } else if (option === 5) {
                    const transfer = parseFloat(prompt("Enter amount to transfer:"));
                    const targetAccountNumber = parseInt(prompt("Enter target account number:"));
                    const targetAccount = await findAccountByNumber(targetAccountNumber);
                    await transfer(transfer, targetAccount);
                } else if (option === 6) {
                    const balance = checkBalance();
                    console.log(`Your current balance is: ${balance}`);
            
                } else if (option === 7) {
                    const viewAccounts = viewAccounts();
                    console.log("All accounts:");
                    viewAccounts.forEach(account => {
                        console.log(`Account Number: ${account.accountNumber}, Account Holder: ${account.accountHolder}, Balance: ${account.balance}`);
                    });
                 } else if (option === 8) { 
                    
                    








            }

