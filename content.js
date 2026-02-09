console.log("Attendance content script loaded");

function waitForTable(selector, timeout = 5000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const interval = setInterval(() => {
      const table = document.querySelector(selector);
      if (table) {
        clearInterval(interval);
        resolve(table);
      } else if (Date.now() - start > timeout) {
        clearInterval(interval);
        resolve(null);
      }
    }, 200);
  });
}

async function getAttendanceData() {
  const table = await waitForTable("table");
  if (!table) return null;

  const rows = Array.from(table.querySelectorAll("tbody tr"));
  const data = rows.map((tr) => {
    const cells = tr.querySelectorAll("td");
    return {
      date: cells[0]?.innerText.trim(),
      campus: cells[1]?.innerText.trim(),
      trainer: cells[2]?.innerText.trim(),
      course: cells[3]?.innerText.trim(),
      slot: cells[4]?.innerText.trim(),
      gender: cells[5]?.innerText.trim(),
      total: cells[6]?.innerText.trim(),
      present: cells[7]?.innerText.trim(),
      leave: cells[8]?.innerText.trim(),
      absent: cells[9]?.innerText.trim(),
      percentage: cells[10]?.innerText.trim()
    };
  });
  return data;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "readAttendance") {
    getAttendanceData().then((data) => sendResponse({ data }));
    return true;
  }
});
