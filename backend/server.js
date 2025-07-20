const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Root route (optional)
app.get("/", (req, res) => {
  res.json({ message: "AI Hint Extension Backend is running" });
});

// Get Hints Endpoint
app.post("/get-hints", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant who gives step-by-step hints for solving programming problems.",
        },
        {
          role: "user",
          content: `Give me 3 hints to solve the LeetCode problem titled: "${title}". Don't give the answer.`,
        },
      ],
    });

    const text = response.data.choices[0].message.content.trim();
    const hints = text.split(/\n+/).map(h => h.trim()).filter(Boolean);

    res.json({ hints });
  } catch (error) {
    console.error("OpenAI Hint Error:", error.message);
    res.status(500).json({ error: "Failed to get hints from AI." });
  }
});

// Get Answer Endpoint
app.post("/get-answer", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a coding assistant that gives complete explanations and code for LeetCode problems.",
        },
        {
          role: "user",
          content: `Give the full solution with explanation and code for the LeetCode problem titled: "${title}".`,
        },
      ],
    });

    const answer = response.data.choices[0].message.content.trim();
    res.json({ answer });
  } catch (error) {
    console.error("OpenAI Answer Error:", error.message);
    res.status(500).json({ error: "Failed to get answer from AI." });
  }
});

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Backend running on port ${process.env.PORT || 3000}`);
});
