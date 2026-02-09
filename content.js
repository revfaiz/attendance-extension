console.log("Attendance Reader running on:", document.title);

// Function to extract attendance from table rows
function extractAttendance() {
  const results = [];
  const rows = document.querySelectorAll("table tbody tr");

  if (!rows || rows.length === 0) return []; // No rows yet

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 10) return; // Safety check

    const date = cells[0].innerText.trim();
    const campus = cells[1].innerText.trim();
    const trainer = cells[2].innerText.trim();
    const course = cells[3].innerText.trim();
    const slot = cells[4].innerText.trim();
    const gender = cells[5].innerText.trim();

    const total = Number(cells[6].innerText.trim());
    const present = Number(cells[7].innerText.trim());
    const leave = Number(cells[8].innerText.trim());
    const absent = Number(cells[9].innerText.trim());

    const percentage =
      total > 0 ? ((present / total) * 100).toFixed(1) + "%" : "0%";

    results.push({
      date,
      campus,
      trainer,
      course,
      slot,
      gender,
      totalStudents: total,
      present,
      leave,
      absent,
      attendancePercentage: percentage
    });
  });

  return results;
}

// Wait until the table exists on the page (React/Angular dynamic pages)
function waitForTable(timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const interval = setInterval(() => {
      const table = document.querySelector("table tbody");
      if (table && table.querySelectorAll("tr").length > 0) {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - start > timeout) {
        clearInterval(interval);
        resolve(false);
      }
    }, 200);
  });
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === "READ_ATTENDANCE") {
    const tableExists = await waitForTable();
    if (!tableExists) {
      sendResponse({ data: [] });
      return;
    }

    const data = extractAttendance();
    sendResponse({ data });
  }
});
