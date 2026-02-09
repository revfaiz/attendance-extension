console.log("Attendance Reader running on:", document.title);

function extractAttendance() {
  const results = [];

  // Ant Design table rows
  const rows = document.querySelectorAll("table tbody tr");

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 10) return; // safety check

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

// Message listener from popup
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "READ_ATTENDANCE") {
    const data = extractAttendance();
    sendResponse({ data });
  }
});
