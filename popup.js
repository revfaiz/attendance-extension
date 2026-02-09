document.getElementById("readBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "READ_ATTENDANCE" },
      response => {
        const output = document.getElementById("output");

        if (!response || !response.data || response.data.length === 0) {
          output.innerText = "No attendance data found.";
          return;
        }

        output.innerText = JSON.stringify(response.data, null, 2);
      }
    );
  });
});
