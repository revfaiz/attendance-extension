let latestData = []; // store latest attendance data
const headers = ["Date", "Campus", "Trainer", "Course", "Slot", "Gender", "Total", "Present", "Leave", "Absent", "%"];

// Format date for Excel (YYYY-MM-DD)
function formatDateForExcel(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split(" ").slice(1).join(" "); // remove day of week
  const date = new Date(parts);
  if (isNaN(date)) return dateStr;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Read Attendance
document.getElementById("readBtn").addEventListener("click", () => {
  const container = document.getElementById("tableContainer");
  container.textContent = "Fetching attendance data...";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        func: () => {
          const table = document.querySelector("table");
          if (!table) return null;
          const rows = Array.from(table.querySelectorAll("tbody tr"));
          return rows.map((tr) => {
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
        }
      },
      (results) => {
        if (!results || !results[0].result || results[0].result.length === 0) {
          container.textContent =
            "Error: Could not access page content. Make sure you are on the campus page.";
          return;
        }

        latestData = results[0].result;

        // Build HTML table
        let html = "<table><thead><tr>";
        headers.forEach(h => html += `<th>${h}</th>`);
        html += "</tr></thead><tbody>";
        latestData.forEach(item => {
          html += "<tr>";
          headers.forEach(h => {
            let key = h.toLowerCase();
            let val = item[key] || "";
            if (h === "Date") val = formatDateForExcel(val);
            html += `<td>${val}</td>`;
          });
          html += "</tr>";
        });
        html += "</tbody></table>";
        container.innerHTML = html;
      }
    );
  });
});

// Copy to Clipboard Helper
function copyData(withHeader) {
  if (!latestData || latestData.length === 0) {
    alert("No data to copy. Please click 'Read Attendance' first.");
    return;
  }
  let tsv = withHeader ? headers.join("\t") + "\n" : "";
  latestData.forEach(item => {
    const row = headers.map(h => {
      let key = h.toLowerCase();
      let val = item[key] || "";
      if (h === "Date") val = formatDateForExcel(val);
      return val;
    }).join("\t");
    tsv += row + "\n";
  });
  navigator.clipboard.writeText(tsv)
    .then(() => alert("Attendance data copied! You can now paste it in Excel."))
    .catch(err => alert("Failed to copy: " + err));
}

// Copy buttons
document.getElementById("copyWithHeaderBtn").addEventListener("click", () => copyData(true));
document.getElementById("copyWithoutHeaderBtn").addEventListener("click", () => copyData(false));
