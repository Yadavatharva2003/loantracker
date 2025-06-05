const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "data.json");

// Helper to read data
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper to write data
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get all transactions with optional filtering by month/year
app.get("/transactions", (req, res) => {
  const { month, year } = req.query;
  let transactions = readData();

  if (month) {
    transactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() + 1 === parseInt(month);
    });
  }
  if (year) {
    transactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getFullYear() === parseInt(year);
    });
  }

  res.json(transactions);
});

// Add new transaction
app.post("/transactions", (req, res) => {
  const transactions = readData();
  const newTransaction = { id: Date.now(), ...req.body };
  transactions.push(newTransaction);
  writeData(transactions);
  res.status(201).json(newTransaction);
});

// Update transaction by id
app.put("/transactions/:id", (req, res) => {
  const { id } = req.params;
  let transactions = readData();
  const index = transactions.findIndex(
    (t) => t.id.toString() === id.toString()
  );
  if (index === -1) {
    return res.status(404).json({ error: "Transaction not found" });
  }
  transactions[index] = { id: transactions[index].id, ...req.body };
  writeData(transactions);
  res.json(transactions[index]);
});

// Delete transaction by id
app.delete("/transactions/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Requested delete ID (raw): '${id}' (type: ${typeof id})`);
  let transactions = readData();
  console.log(
    "Available transaction IDs and types:",
    transactions.map((t) => ({ id: t.id, type: typeof t.id }))
  );
  console.log("Before deletion, transactions count:", transactions.length);
  const initialLength = transactions.length;
  transactions = transactions.filter(
    (t) => t.id.toString().trim() !== id.toString().trim()
  );
  console.log("After deletion, transactions count:", transactions.length);
  if (transactions.length === initialLength) {
    console.log("Transaction not found for id:", id);
    return res.status(404).json({ error: "Transaction not found" });
  }
  try {
    console.log("Writing data to file:", transactions);
    writeData(transactions);
    console.log("Data written successfully after deletion");
    res.status(204).send();
  } catch (err) {
    console.error("Error writing data after deletion:", err);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

app.get("/debug/transactions", (req, res) => {
  const transactions = readData();
  res.json(
    transactions.map((t) => ({
      id: t.id,
      type: typeof t.id,
      amount: t.amount,
      description: t.description,
    }))
  );
});

const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: "sk-abcdef1234567890abcdef1234567890abcdef12",
});

app.post("/api/ai/financial-advice", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });
    const advice = completion.choices[0].message.content.trim();
    res.json({ advice });
  } catch (error) {
    console.error("Error fetching AI advice:", error);
    res.status(500).json({ error: "Failed to fetch AI advice" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
