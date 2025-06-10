// Store records in an array
        let records = [];

        // Get records from localStorage
        function getRecords() {
            const data = localStorage.getItem("myRecords");
            return data ? JSON.parse(data) : []; // Return array or empty if none
        }

        // Save records to localStorage
        function saveRecords() {
            localStorage.setItem("myRecords", JSON.stringify(records));
        }

        // Add a new record
        function addRecord() {
            const input = document.getElementById("nameInput");
            const name = input.value.trim(); // Remove extra spaces
            if (name === "") return; // Skip if empty
            records = getRecords(); // Get current records
            records.push(name); // Add new name
            saveRecords(); // Save to localStorage
            input.value = ""; // Clear input
            displayRecords(); // Show updated list
        }

        // Delete a record
        function deleteRecord(index) {
            records = getRecords(); // Get current records
            records.splice(index, 1); // Remove record
            saveRecords(); // Save to localStorage
            displayRecords(); // Show updated list
        }

        // Edit or save a record
        function updateRecord(index, isSaving = false, newName = "") {
            records = getRecords(); // Get current records
            const list = document.getElementById("recordList");
            const recordDiv = list.children[index];

            if (isSaving) {
                // Save the edited name
                const trimmedName = newName.trim();
                if (trimmedName === "") return; // Skip if empty
                records[index] = trimmedName; // Update record
                saveRecords(); // Save to localStorage
                displayRecords(); // Show updated list
            } else {
                // Show edit input field
                recordDiv.innerHTML = `
                    <div class="record-text">
                        ${index + 1}. <input type="text" class="edit-input" value="${records[index]}" id="editInput${index}">
                    </div>
                    <div class="record-actions">
                        <button onclick="updateRecord(${index}, true, document.getElementById('editInput${index}').value)">Save</button>
                        <button onclick="displayRecords()">Cancel</button>
                    </div>
                `;
                document.getElementById(`editInput${index}`).focus(); // Focus input
            }
        }

        // Show all records
        function displayRecords() {
            records = getRecords(); // Get current records
            const list = document.getElementById("recordList");
            list.innerHTML = ""; // Clear list
            records.forEach((name, index) => {
                const safeName = name.replace(/'/g, "\\'"); // Escape quotes
                list.innerHTML += `
                    <div class="records">
                        <div class="record-text">${index + 1}. ${name}</div>
                        <div class="record-actions">
                            <button onclick="updateRecord(${index})">Edit</button>
                            <button onclick="deleteRecord(${index})">Delete</button>
                        </div>
                    </div>`;
            });
        }

        // Load records when page opens
        window.onload = displayRecords;
