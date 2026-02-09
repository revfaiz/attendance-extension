const button = document.getElementById("readAttendance");
const tableBody = document.querySelector("#attendanceTable tbody");
const message = document.getElementById("message");

button.addEventListener("click", () => {
  tableBody.innerHTML = "";
  message.textContent = "Reading attendance...";

  // Get the current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    // Send message to content script
    chrome.tabs.sendMessage(tabId, { type: "READ_ATTENDANCE" }, (response) => {
      if (chrome.runtime.lastError) {
        // Handle case where content script isn't loaded
        message.textContent = "Error: Could not access page content. Make sure you are on the campus page.";
        console.error(chrome.runtime.lastError);
        return;
      }

      const data = response?.data || [];
      if (data.length === 0) {
        message.textContent = "No attendance data found.";
        return;
      }

      message.textContent = `Found ${data.length} records.`;

      // Populate table
      data.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.date}</td>
          <td>${row.campus}</td>
          <td>${row.trainer}</td>
          <td>${row.course}</td>
          <td>${row.slot}</td>
          <td>${row.gender}</td>
          <td>${row.totalStudents}</td>
          <td>${row.present}</td>
          <td>${row.leave}</td>
          <td>${row.absent}</td>
          <td>${row.attendancePercentage}</td>
        `;
        tableBody.appendChild(tr);
      });
    });
  });
});
