let currentHint = 0;
let hintList = [];

const statusDiv = document.getElementById("status");
const nextBtn = document.getElementById("next");
const ansBtn = document.getElementById("getAnswer");

function updateStatus(text) {
  statusDiv.innerText = text;
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { type: "GET_TITLE" }, (res) => {
    if (!res || !res.title) {
      updateStatus("No problem title found. Are you on a LeetCode problem page?");
      return;
    }

    updateStatus(`Problem: ${res.title}`);
    
    // Fetch Hints immediately
    fetch("http://localhost:3000/get-hints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: res.title })
    })
    .then(r => r.json())
    .then(data => {
      hintList = data.hints;
      if (hintList.length > 0) nextBtn.style.display = "block";
      ansBtn.style.display = "block";
    })
    .catch(() => updateStatus("Error: Is the backend server running?"));
  });
});

nextBtn.onclick = () => {
  if (currentHint < hintList.length) {
    const li = document.createElement("li");
    li.innerText = hintList[currentHint++];
    document.getElementById("hints").appendChild(li);
    if (currentHint === hintList.length) nextBtn.disabled = true;
  }
};

ansBtn.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "GET_TITLE" }, (res) => {
      fetch("http://localhost:3000/get-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: res.title })
      })
      .then(r => r.json())
      .then(data => {
        const p = document.getElementById("answer");
        p.innerText = data.answer;
        p.style.display = "block";
      });
    });
  });
};