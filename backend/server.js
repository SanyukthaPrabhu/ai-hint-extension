const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Helper to communicate with OpenAI
async function callOpenAI(prompt) {
  return await axios.post("https://api.openai.com/v1/chat/completions", {
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: "You are a helpful coding tutor." }, { role: "user", content: prompt }],
    temperature: 0.7
  }, {
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
  });
}

app.post("/get-hints", async (req, res) => {
  const { title } = req.body;
  console.log("Request received for title:", title);

  if (!title) {
    console.error("Error: No title received in request body");
    return res.status(400).send("Title is required");
  }

  try {
    console.log("Calling OpenAI API...");
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Give 3 step-by-step hints for "${title}".` }]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    console.log("OpenAI responded successfully!");
    const message = response.data.choices[0].message.content;
    const hints = message.split("\n").filter(line => line.trim());
    res.json({ hints });

  } catch (err) {
    // This logs the SPECIFIC OpenAI error to your terminal
    if (err.response) {
      console.error("OpenAI API Error Status:", err.response.status);
      console.error("OpenAI API Error Data:", err.response.data);
    } else {
      console.error("Standard Server Error:", err.message);
    }
    res.status(500).send("API Error");
  }
});

app.post("/get-answer", async (req, res) => {
  const { title } = req.body;
  const prompt = `Explain the logic for solving "${title}". Describe the algorithm and time complexity, but do not provide the actual code.`;

  try {
    const response = await callOpenAI(prompt);
    res.json({ answer: response.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "AI Service Error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));