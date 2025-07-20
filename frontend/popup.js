let currentHint = 0;
let hintList = [];

// Handle "Next Hint" button
document.getElementById("next").onclick = () => {
  if (currentHint < hintList.length) {
    const li = document.createElement("li");
    li.innerText = hintList[currentHint++];
    document.getElementById("hints").appendChild(li);
  }
};

// Handle "Get Answer" button
document.getElementById("getAnswer").onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "GET_TITLE" }, (res) => {
      fetch("https://ai-hint-extension.onrender.com/get-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: res.title })
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Server Error: ${errorText}`);
          }
          return res.json();
        })
        .then(data => {
          document.getElementById("answer").innerText = data.answer || "No answer returned.";
        })
        .catch(err => {
          console.error("Fetch answer error:", err.message);
          document.getElementById("answer").innerText = "Failed to fetch answer.";
        });
    });
  });
};

// Automatically fetch hints on popup load
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { type: "GET_TITLE" }, (res) => {
    fetch("https://ai-hint-extension.onrender.com/get-hints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: res.title })
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Server Error: ${errorText}`);
        }
        return res.json();
      })
      .then(data => {
        hintList = data.hints || [];
        if (hintList.length === 0) {
          const li = document.createElement("li");
          li.innerText = "No hints available.";
          document.getElementById("hints").appendChild(li);
        }
      })
      .catch(err => {
        console.error("Fetch hints error:", err.message);
        const li = document.createElement("li");
        li.innerText = "Failed to fetch hints.";
        document.getElementById("hints").appendChild(li);
      });
  });
});
