chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "READ_ATTENDANCE") {
    const data = extractAttendance();
    sendResponse({ data });
  }
});

/**
 * Main extraction function
 */
function extractAttendance() {
  let results = [];

  // 1️⃣ Try TABLE-BASED layout
  const tables = document.querySelectorAll("table");

  tables.forEach((table) => {
    const rows = table.querySelectorAll("tr");

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");

      if (cells.length >= 2) {
        const className = cells[0].innerText.trim();
        const attendance = cells[1].innerText.trim();

        if (looksLikeAttendance(attendance)) {
          results.push({ className, attendance });
        }
      }
    });
  });

  // 2️⃣ If nothing found, try CARD / DIV layout
  if (results.length === 0) {
    const cards = document.querySelectorAll("div");

    cards.forEach((card) => {
      const text = card.innerText;

      if (!text) return;

      // Example patterns: "Attendance: 85%" or "Attendance - 12/15"
      const attendanceMatch = text.match(
        /(attendance[:\s-]+)(\d+%|\d+\/\d+)/i
      );

      if (attendanceMatch) {
        const attendance = attendanceMatch[2];
        const className = text.split("\n")[0].trim();

        results.push({ className, attendance });
      }
    });
  }

  return results;
}

/**
 * Simple helper to detect attendance-like values
 */
function looksLikeAttendance(text) {
  return /\d+%|\d+\/\d+/.test(text);
}
