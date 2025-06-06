import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const TotalLoanExpensePie = ({ transactions }) => {
  const totalLoan = transactions
    .filter((t) => t.type === "loan")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const pieData = {
    labels: ["Loan", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [totalLoan, totalExpense],
        backgroundColor: ["#2563eb", "#16a34a"],
        hoverOffset: 30,
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2 text-center">
        Total Loan vs Expense
      </h2>
      <Pie data={pieData} />
    </div>
  );
};

const MonthlyLoanExpenseBar = ({ transactions }) => {
  const monthlyData = {};
  transactions.forEach(({ date, amount, type }) => {
    const monthYear = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { loan: 0, expense: 0 };
    }
    monthlyData[monthYear][type] += amount;
  });

  const labels = Object.keys(monthlyData).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const loanData = labels.map((label) => monthlyData[label].loan);
  const expenseData = labels.map((label) => monthlyData[label].expense);

  const barData = {
    labels,
    datasets: [
      {
        label: "Loan",
        data: loanData,
        backgroundColor: "#2563eb",
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "#16a34a",
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Bar
        data={barData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Monthly Loan & Expense Trend" },
          },
        }}
      />
    </div>
  );
};

const ExpenseByCategoryPie = ({ transactions }) => {
  const categoryData = {};
  transactions.forEach(({ type, category, amount }) => {
    if (type === "expense") {
      if (!categoryData[category]) {
        categoryData[category] = 0;
      }
      categoryData[category] += amount;
    }
  });

  const categoryLabels = Object.keys(categoryData);
  const categoryAmounts = categoryLabels.map((label) => categoryData[label]);

  const categoryPieData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Expense by Category",
        data: categoryAmounts,
        backgroundColor: [
          "#f87171",
          "#60a5fa",
          "#34d399",
          "#fbbf24",
          "#a78bfa",
          "#f472b6",
          "#facc15",
        ],
        hoverOffset: 30,
      },
    ],
  };

  const categoryOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Expense by Category" },
    },
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2 text-center">
        Expense by Category
      </h2>
      <Pie data={categoryPieData} options={categoryOptions} />
    </div>
  );
};

const Chart = ({
  transactions,
  showTotalLoanExpense = true,
  showMonthlyTrend = true,
  showExpenseByCategory = true,
}) => {
  return (
    <div className="space-y-8">
      {showTotalLoanExpense && (
        <TotalLoanExpensePie transactions={transactions} />
      )}
      {showMonthlyTrend && (
        <MonthlyLoanExpenseBar transactions={transactions} />
      )}
      {showExpenseByCategory && (
        <ExpenseByCategoryPie transactions={transactions} />
      )}
    </div>
  );
};

export default Chart;
