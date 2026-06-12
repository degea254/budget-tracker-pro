class BudgetTracker {
    constructor() {
        this.transactions = this.loadTransactions();

        this.form = document.getElementById("transactionForm");
        this.transactionList = document.getElementById("transactionList");
        this.balanceElement = document.getElementById("balance");

        this.initEventListeners();
        this.renderTransactions();
        this.updateBalance();
    }

    loadTransactions() {
        return JSON.parse(localStorage.getItem("transactions")) || [];
    }

    saveTransactions() {
        localStorage.setItem("transactions", JSON.stringify(this.transactions));
    }

    initEventListeners() {
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.addTransaction();
        });
    }

    addTransaction() {
        const description = document.getElementById("description").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;

        if (description === "" || isNaN(amount)) {
            alert("Please enter a valid description and amount.");
            return;
        }

        const transaction = {
            id: Date.now(),
            description,
            amount: type === "expense" ? -amount : amount,
            type,
        };

        this.transactions.push(transaction);
        this.saveTransactions();
        this.renderTransactions();
        this.updateBalance();

        // Clear the form
        this.form.reset();
    }

    renderTransactions() {
        this.transactionList.innerHTML = "";
        this.transactions
            .slice()
            .sort((a, b) => b.id - a.id)
            .forEach((transaction) => {
                const transactionDiv = document.createElement("div");
                transactionDiv.classList.add("transaction", transaction.type);
                transactionDiv.innerHTML = `
                    <span>${transaction.description}</span>
                    <span class="transaction-amount-container"
                      >$${Math.abs(transaction.amount).toFixed(2)}
                      <button class="delete-btn" data-id="${transaction.id}">Delete</button>
                    </span>
                `;
                this.transactionList.appendChild(transactionDiv);
            });

        this.attachDeleteEventListeners();
    }

    attachDeleteEventListeners() {
        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", () => {
                this.deleteTransaction(Number(button.dataset.id));
            });
        });
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter((t) => t.id !== id);

        this.saveTransactions();
        this.renderTransactions();
        this.updateBalance();
    }

    updateBalance() {
        const balance = this.transactions.reduce(
            (acc, transaction) => acc + transaction.amount,
            0,
        );
        this.balanceElement.textContent = `Balance: $${balance.toFixed(2)}`;
        this.balanceElement.style.color = balance >= 0 ? "darkgreen" : "red";
    }
}

const budgetTracker = new BudgetTracker();
