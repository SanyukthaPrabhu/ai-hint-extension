const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/get-hints", async (req, res) => {
  const { title } = req.body;
  const prompt = `Give 3 step-by-step hints for solving the coding problem titled "${title}". Do not reveal the answer.`;

  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const message = response.data.choices[0].message.content;
    const hints = message.split("\n").filter(line => line.trim());
    res.json({ hints });

  } catch (err) {
    console.error(err);
    res.status(500).send("API Error");
  }
});

app.post("/get-answer", async (req, res) => {
  const { title } = req.body;
  const prompt = `Give a detailed explanation (but not direct code) for solving the problem titled "${title}".`;

  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const message = response.data.choices[0].message.content;
    res.json({ answer: message });

  } catch (err) {
    console.error(err);
    res.status(500).send("API Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
