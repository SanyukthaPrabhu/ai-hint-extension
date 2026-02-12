const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai"); //
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Fast and free-tier friendly

app.post("/get-hints", async (req, res) => {
  const { title } = req.body;
  const prompt = `Give 3 step-by-step hints for the coding problem "${title}". 
  Return ONLY the hints, each on a new line. Do not reveal the answer or use numbers.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const hints = text.split("\n").filter(line => line.trim());
    res.json({ hints });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).send("API Error");
  }
});

app.post("/get-answer", async (req, res) => {
  const { title } = req.body;
  const prompt = `Provide a detailed logic explanation for solving "${title}" without giving the direct code.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ answer: response.text() });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).send("API Error");
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));