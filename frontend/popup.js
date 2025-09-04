let currentHint = 0;
let hintList = [];

document.getElementById("next").onclick = () => {
  if (currentHint < hintList.length) {
    const li = document.createElement("li");
    li.innerText = hintList[currentHint++];
    document.getElementById("hints").appendChild(li);
  }
};

document.getElementById("getAnswer").onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "GET_TITLE" }, (res) => {
      fetch("http://localhost:3000/get-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: res.title })
      })
        .then(res => res.json())
        .then(data => {
          document.getElementById("answer").innerText = data.answer;
        });
    });
  });
};

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { type: "GET_TITLE" }, (res) => {
    fetch("http://localhost:3000/get-hints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: res.title })
    })
      .then(res => res.json())
      .then(data => {
        hintList = data.hints;
      });
  });
});
