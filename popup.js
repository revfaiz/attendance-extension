document.getElementById("readBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "READ_ATTENDANCE" },
      (response) => {
        if (!response || !response.data) {
          document.getElementById("output").textContent =
            "No attendance data found.";
          return;
        }

        // Pretty print JSON
        document.getElementById("output").textContent =
          JSON.stringify(response.data, null, 2);
      }
    );
  });
});
