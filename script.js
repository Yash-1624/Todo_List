// In-memory storage that persists across page refreshes using URL hash
let recordStorage = [];

// Initialize records from URL hash on page load
function initializeStorage() {
    try {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const decoded = decodeURIComponent(hash);
            recordStorage = JSON.parse(decoded);
        }
    } catch (e) {
        recordStorage = [];
    }
}

// Save records to URL hash for persistence
function persistToURL() {
    try {
        const encoded = encodeURIComponent(JSON.stringify(recordStorage));
        window.location.hash = encoded;
    } catch (e) {
        // If data is too large for URL, use fallback
        console.warn('Data too large for URL storage');
    }
}

// Retrieves records from storage, returns empty array if none exist
function getRec() {
    return recordStorage || [];
}

// Saves records to storage
function saveRec(recs) {
    recordStorage = [...recs];
    persistToURL();
}

// Adds a new record from input field
function addRec() {
    const input = document.getElementById("nameInput");
    const name = input.value.trim(); // Remove extra spaces
    if (!name) return; // Do nothing if input is empty
    const records = getRec();
    records.push(name); // Add new name to records
    saveRec(records); // Save to storage
    input.value = ''; // Clear input field
    disRec(); // Refresh display
}

// Deletes a record by index
function deleteRec(index) {
    const records = getRec();
    records.splice(index, 1); // Remove record at index
    saveRec(records); // Save updated records
    disRec(); // Refresh display
}

// Handles both starting and saving edit for a record
function updateRec(index, isSaving = false, newName = '') {
    const records = getRec();
    const list = document.getElementById("recordList");
    const recordDiv = list.children[index];

    if (isSaving) {
        // Save mode: Update record with new name
        const trimmedName = newName.trim();
        if (!trimmedName) return; // Do nothing if new name is empty
        records[index] = trimmedName; // Update record
        saveRec(records); // Save to storage
        disRec(); // Refresh display
    } else {
        // Edit mode: Show input field with current name
        recordDiv.innerHTML = `
                    <div class="record-text">
                        ${index + 1}. <input type="text" class="edit-input" value="${records[index]}" id="editInput${index}">
                    </div>
                    <div class="record-actions">
                        <button onclick="updateRec(${index}, true, document.getElementById('editInput${index}').value)">Save</button>
                        <button onclick="disRec()">Cancel</button>
                    </div>
                `;
        document.getElementById(`editInput${index}`).focus(); // Auto-focus input
    }
}

// Displays all records
function disRec() {
    const records = getRec();
    const list = document.getElementById("recordList");
    list.innerHTML = ""; // Clear current list
    records.forEach((name, index) => {
        // Escape single quotes in name to prevent JS errors
        const escapedName = name.replace(/'/g, "\\'");
        list.innerHTML += `
                    <div class="records">
                        <div class="record-text">${index + 1}. ${name}</div>
                        <div class="record-actions">
                            <button onclick="updateRec(${index})">Edit</button>
                            <button onclick="deleteRec(${index})">Delete</button>
                        </div>
                    </div>`;
    });
}

// Load records when page loads
window.onload = function () {
    initializeStorage();
    disRec();
};

// Handle browser back/forward buttons
window.addEventListener('hashchange', function () {
    initializeStorage();
    disRec();
});