function getProblemTitle() {
  // Make sure we are on a LeetCode problem page
  if (window.location.hostname.includes("leetcode.com")) {
    // Try multiple selectors as LeetCode's DOM structure changes
    const selectors = [
      "div[data-cy='question-title']",
      "h1[data-cy='question-title']", 
      ".css-v3d350", // Common LeetCode title class
      "[data-testid='question-title']",
      "h1.text-title-large",
      ".question-title h3",
      ".question-content .question-title"
    ];
    
    for (const selector of selectors) {
      const titleElement = document.querySelector(selector);
      if (titleElement && titleElement.innerText.trim()) {
        console.log(`Found title using selector: ${selector}`);
        return titleElement.innerText.trim();
      }
    }
    
    console.log("Could not find problem title with any selector");
  }
  return "";
}

// Listener to handle GET_TITLE messages from popup.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_TITLE") {
    try {
      const title = getProblemTitle();
      console.log("Retrieved title:", title);
      sendResponse({ title: title || "No title found" });
    } catch (error) {
      console.error("Error getting problem title:", error);
      sendResponse({ title: "Error retrieving title" });
    }
  }

  // Required if using async or DOM reads
  return true;
});
