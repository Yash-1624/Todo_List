let records = [];

        function getRecords() {
            try {
                const data = localStorage.getItem("myRecords");
                return data ? JSON.parse(data) : [];
            } catch (e) {
                console.error("Error retrieving records from localStorage:", e);
                return [];
            }
        }

        function saveRecords() {
            try {
                localStorage.setItem("myRecords", JSON.stringify(records));
            } catch (e) {
                console.error("Error saving records to localStorage:", e);
            }
        }

        function addRecord() {
            const input = document.getElementById("nameInput");
            if (!input) {
                console.error("Input element 'nameInput' not found");
                return;
            }

            const name = input.value.trim();

            // ✅ FIXED: skip if input is empty
            if (!name) return;

            records = getRecords();
            records.push(name);
            saveRecords();
            input.value = "";
            displayRecords();
        }

        function deleteRecord(index) {
            records = getRecords();
            if (index >= 0 && index < records.length) {
                records.splice(index, 1);
                saveRecords();
                displayRecords();
            }
        }

        function updateRecord(index, isSaving = false, newName = "") {
            records = getRecords();
            if (index < 0 || index >= records.length) return;

            const list = document.getElementById("recordList");
            if (!list) {
                console.error("Record list element 'recordList' not found");
                return;
            }

            const recordDiv = list.children[index];

            if (isSaving) {
                const trimmedName = newName.trim();
                if (trimmedName !== "") {
                    records[index] = trimmedName;
                    saveRecords();
                    displayRecords();
                }
            } else {
                recordDiv.innerHTML = `
          <div class="record-text">
              ${index + 1}. <input type="text" class="edit-input" value="${records[index]}" id="editInput${index}" aria-label="Edit record ${index + 1}">
          </div>
          <div class="record-actions">
              <button onclick="updateRecord(${index}, true, document.getElementById('editInput${index}').value)">Save</button>
              <button onclick="displayRecords()">Cancel</button>
          </div>
        `;
                document.getElementById(`editInput${index}`).focus();
            }
        }

        function displayRecords() {
            records = getRecords();
            const list = document.getElementById("recordList");
            if (!list) {
                console.error("Record list element 'recordList' not found");
                return;
            }

            list.innerHTML = "";

            records.forEach((name, index) => {
                // ✅ Escape for safety
                const safeName = name
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;");

                list.innerHTML += `
          <div class="records" role="listitem">
              <div class="record-text">${index + 1}. ${safeName}</div>
              <div class="record-actions">
                  <button onclick="updateRecord(${index})" aria-label="Edit record ${safeName}">Edit</button>
                  <button onclick="deleteRecord(${index})" aria-label="Delete record ${safeName}">Delete</button>
              </div>
          </div>
        `;
            });
        }

        window.onload = () => {
            displayRecords();

            const input = document.getElementById("nameInput");
            if (input) {
                input.addEventListener("keypress", (event) => {
                    if (event.key === "Enter") {
                        addRecord();
                    }
                });
            }
        };
