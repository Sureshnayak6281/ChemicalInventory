// Sample data
const chemicalData = [
    { id: 1, name: "Acetone", vendor: "ChemCo", density: 0.79, viscosity: 0.32, packaging: "Bottle", packSize: 1, unit: "L", quantity: 10 },
    { id: 2, name: "Ethanol", vendor: "LabSupplies", density: 0.79, viscosity: 1.2, packaging: "Can", packSize: 5, unit: "L", quantity: 5 },
    { id: 3, name: "Sulfuric Acid", vendor: "AcidInc", density: 1.84, viscosity: 26.7, packaging: "Bottle", packSize: 2.5, unit: "L", quantity: 3 },
    { id: 4, name: "Hydrochloric Acid", vendor: "ChemCorp", density: 1.18, viscosity: 6.5, packaging: "Can", packSize: 2, unit: "L", quantity: 7 },
    { id: 5, name: "Methanol", vendor: "ChemCo", density: 0.79, viscosity: 0.5, packaging: "Bottle", packSize: 2, unit: "L", quantity: 8 },
    { id: 6, name: "Benzene", vendor: "LabSupplies", density: 0.88, viscosity: 0.652, packaging: "Can", packSize: 4, unit: "L", quantity: 6 },
    { id: 7, name: "Nitric Acid", vendor: "AcidInc", density: 1.51, viscosity: 11.2, packaging: "Bottle", packSize: 1, unit: "L", quantity: 4 },
    { id: 8, name: "Isopropanol", vendor: "ChemCorp", density: 0.79, viscosity: 2.3, packaging: "Can", packSize: 3, unit: "L", quantity: 5 },
    { id: 9, name: "Formic Acid", vendor: "ChemCo", density: 1.22, viscosity: 3.8, packaging: "Bottle", packSize: 0.5, unit: "L", quantity: 9 },
    { id: 10, name: "Acetic Acid", vendor: "LabSupplies", density: 1.05, viscosity: 1.5, packaging: "Can", packSize: 2.5, unit: "L", quantity: 3 },
    { id: 11, name: "Propylene Glycol", vendor: "ChemCorp", density: 1.036, viscosity: 1.12, packaging: "Bottle", packSize: 1, unit: "L", quantity: 6 },
    { id: 12, name: "Acetonitrile", vendor: "LabSupplies", density: 0.78, viscosity: 0.32, packaging: "Can", packSize: 3, unit: "L", quantity: 4 },
    { id: 13, name: "Dimethyl Sulfoxide", vendor: "ChemCo", density: 1.1, viscosity: 2.5, packaging: "Bottle", packSize: 2, unit: "L", quantity: 7 },
    { id: 14, name: "Toluene", vendor: "LabSupplies", density: 0.87, viscosity: 0.56, packaging: "Can", packSize: 5, unit: "L", quantity: 2 },
    { id: 15, name: "Ethyl Acetate", vendor: "AcidInc", density: 0.9, viscosity: 0.85, packaging: "Bottle", packSize: 1.5, unit: "L", quantity: 5 }
];


// Function to populate the table
function populateTable() {
    const tableBody = document.querySelector("#chemicalTable tbody");
    tableBody.innerHTML = "";
    chemicalData.forEach(chemical => {
        const row = `
            <tr data-id="${chemical.id}">
                <td class="checkbox-cell">
                    <input type="checkbox" class="row-checkbox">
                </td>
                <td>${chemical.id}</td>
                <td>${chemical.name}</td>
                <td>${chemical.vendor}</td>
                <td>${chemical.density}</td>
                <td>${chemical.viscosity}</td>
                <td>${chemical.packaging}</td>
                <td>${chemical.packSize}</td>
                <td>${chemical.unit}</td>
                <td>${chemical.quantity}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
    addRowEventListeners();
}

// Add event listeners to rows
function addRowEventListeners() {
    const rows = document.querySelectorAll("#chemicalTable tbody tr");
    rows.forEach(row => {
        row.querySelector('.row-checkbox').addEventListener('change', function() {
            row.classList.toggle('selected', this.checked);
        });
        row.querySelector('.edit-btn').addEventListener('click', function() {
            editRow(row.dataset.id);
        });
    });
}

// Sorting function
function sortTable(column) {
    chemicalData.sort((a, b) => {
        if (a[column] < b[column]) return -1;
        if (a[column] > b[column]) return 1;
        return 0;
    });
    populateTable();
}

// Add event listeners to table headers for sorting
document.querySelectorAll("#chemicalTable th").forEach((header, index) => {
    if (index > 0) { // Skip the checkbox column
        header.addEventListener("click", () => {
            const column = Object.keys(chemicalData[0])[index - 1];
            sortTable(column);
        });
    }
});

// Row manipulation functions
function addRow() {
    const newId = Math.max(...chemicalData.map(c => c.id)) + 1;
    const newChemical = { id: newId, name: "New Chemical", vendor: "", density: 0, viscosity: 0, packaging: "", packSize: 0, unit: "", quantity: 0 };
    chemicalData.push(newChemical);
    populateTable();
    editRow(newId); // Automatically edit the new row
    document.querySelector(`tr[data-id="${newId}"]`).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function moveRow(direction) {
    const selectedRows = document.querySelectorAll("#chemicalTable tbody tr.selected");
    if (selectedRows.length !== 1) return; // Only move if exactly one row is selected
    
    const currentIndex = Array.from(selectedRows[0].parentNode.children).indexOf(selectedRows[0]);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < chemicalData.length) {
        [chemicalData[currentIndex], chemicalData[newIndex]] = [chemicalData[newIndex], chemicalData[currentIndex]];
        populateTable();
        document.querySelectorAll("#chemicalTable tbody tr")[newIndex].classList.add('selected');
        document.querySelectorAll("#chemicalTable tbody tr")[newIndex].querySelector('.row-checkbox').checked = true;
    }
}

function deleteRow() {
    const selectedRows = document.querySelectorAll("#chemicalTable tbody tr.selected");
    selectedRows.forEach(row => {
        const id = parseInt(row.dataset.id);
        const index = chemicalData.findIndex(c => c.id === id);
        chemicalData.splice(index, 1);
    });
    populateTable();
}

// Edit functionality
function editRow(id) {
    const chemical = chemicalData.find(c => c.id === parseInt(id));
    const row = document.querySelector(`#chemicalTable tbody tr[data-id="${id}"]`);
    row.innerHTML = `
        <td class="checkbox-cell">
            <input type="checkbox" class="row-checkbox" ${row.classList.contains('selected') ? 'checked' : ''}>
        </td>
        <td>${chemical.id}</td>
        <td><input class="form-control form-control-sm" value="${chemical.name}"></td>
        <td><input class="form-control form-control-sm" value="${chemical.vendor}"></td>
        <td><input class="form-control form-control-sm" type="number" value="${chemical.density}"></td>
        <td><input class="form-control form-control-sm" type="number" value="${chemical.viscosity}"></td>
        <td><input class="form-control form-control-sm" value="${chemical.packaging}"></td>
        <td><input class="form-control form-control-sm" type="number" value="${chemical.packSize}"></td>
        <td><input class="form-control form-control-sm" value="${chemical.unit}"></td>
        <td><input class="form-control form-control-sm" type="number" value="${chemical.quantity}"></td>
        <td>
            <button class="btn btn-sm btn-outline-success save-btn">
                <i class="fas fa-check"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger cancel-btn">
                <i class="fas fa-times"></i>
            </button>
        </td>
    `;
    row.querySelector('.save-btn').addEventListener('click', () => saveRow(id));
    row.querySelector('.cancel-btn').addEventListener('click', () => cancelEdit(id));
    row.querySelector('input').focus(); // Focus on the first input field
}

function saveRow(id) {
    const row = document.querySelector(`#chemicalTable tbody tr[data-id="${id}"]`);
    const inputs = row.querySelectorAll("input");
    const chemical = chemicalData.find(c => c.id === parseInt(id));
    chemical.name = inputs[1].value;
    chemical.vendor = inputs[2].value;
    chemical.density = parseFloat(inputs[3].value);
    chemical.viscosity = parseFloat(inputs[4].value);
    chemical.packaging = inputs[5].value;
    chemical.packSize = parseFloat(inputs[6].value);
    chemical.unit = inputs[7].value;
    chemical.quantity = parseInt(inputs[8].value);
    populateTable();
}

function cancelEdit(id) {
    populateTable();
}

// Refresh and Save functionality
function refreshData() {
    // In a real application, this would fetch fresh data from a server
    populateTable();
}

function saveData() {
    // In a real application, this would send the data to a server
    console.log("Data saved:", JSON.stringify(chemicalData));
    alert("Data saved successfully!");
}

// Select All functionality
document.getElementById('selectAll').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
        checkbox.dispatchEvent(new Event('change'));
    });
});

// Add event listeners to buttons
document.getElementById("addRow").addEventListener("click", addRow);
document.getElementById("moveUp").addEventListener("click", () => moveRow('up'));
document.getElementById("moveDown").addEventListener("click", () => moveRow('down'));
document.getElementById("deleteRow").addEventListener("click", deleteRow);
document.getElementById("refresh").addEventListener("click", refreshData);
document.getElementById("save").addEventListener("click", saveData);

// Initialize the table
populateTable();