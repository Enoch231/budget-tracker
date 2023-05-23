let form = document.querySelector(".add");
let incomeItem = document.querySelector("ul.income__item");
let expenseItem = document.querySelector("ul.expense-item");
let balance = document.getElementById("balance");
let income = document.getElementById("income");
let expense = document.getElementById("expense");
// console.log(balance);
// console.log(income);
// console.log(expense);

let transactions =
  localStorage.getItem("transactions") !== null
    ? JSON.parse(localStorage.getItem("transactions"))
    : [];

const updateStatistics = () => {
  const updatedIncome = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => (total += transaction.amount), 0);
  console.log(updatedIncome);

  const updatedExpense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => (total += Math.abs(transaction.amount)), 0);
  console.log(updatedExpense);

  updatedBalance = updatedIncome - updatedExpense;
  balance.textContent = updatedBalance;
  income.textContent = updatedIncome;
  expense.textContent = updatedExpense;
};
updateStatistics();

const generateTemplate = (id, source, amount, time) => {
  return `<li data-id=${id}>
            <p>
              <span>${source} </span>
              <span class="date">${time}</span>
            </p>
            $<span>${amount}</span>
            <i class="bi bi-trash-fill delete"></i>
          </li>`;
};

const addTransactionDom = (id, source, amount, time) => {
  if (amount >= 0) {
    incomeItem.innerHTML += generateTemplate(id, source, amount, time);
  } else {
    expenseItem.innerHTML += generateTemplate(
      id,
      source,
      Math.abs(amount),
      time
    );
  }
};

const addTransaction = (source, amount) => {
  const date = new Date();
  const transaction = {
    id: Math.floor(Math.random() * 10000),
    source: source,
    amount: amount,
    time: `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`,
  };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  addTransactionDom(transaction.id, source, amount, transaction.time);
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (form.source.value.trim() == "" || form.amount.value.trim() == "") {
    return alert("Please add proper values!");
  }
  addTransaction(form.source.value.trim(), Number(form.amount.value.trim()));
  updateStatistics();
  form.reset();
});

const deleteTransaction = (id) => {
  transactions = transactions.filter((transaction) => {
    return transaction.id !== id;
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

incomeItem.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(Number(event.target.parentElement.dataset.id));
    updateStatistics();
  }
});

expenseItem.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(Number(event.target.parentElement.dataset.id));
    updateStatistics();
  }
});

const getTransactions = () => {
  transactions.forEach((transaction) => {
    if (transaction.amount >= 0) {
      incomeItem.innerHTML += generateTemplate(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.time
      );
    } else {
      expenseItem.innerHTML += generateTemplate(
        transaction.id,
        transaction.source,
        Math.abs(transaction.amount),
        transaction.time
      );
    }
  });
};
getTransactions();
