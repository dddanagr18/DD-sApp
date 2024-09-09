let barcodes = [];
let loggedInUser = '';

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const users = [
    { username: 'admin', password: 'password123' },
    { username: 'KPC', password: '58595859' }
  ];

  const validUser = users.find(user => user.username === username && user.password === password);

  if (validUser) {
    loggedInUser = username;
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('scanning-section').style.display = 'block';
  } else {
    alert('Invalid credentials, please try again.');
  }
}

function addBarcode() {
  const date = document.getElementById('date').value;
  const salesOrder = document.getElementById('salesOrder').value;
  const barcode = document.getElementById('barcode').value;

  if (!date || !salesOrder || !barcode) {
    alert('Please fill in all fields.');
    return;
  }

  if (barcodes.includes(barcode)) {
    alert('This barcode has already been scanned.');
    return;
  }

  barcodes.push(barcode);
  const tableBody = document.getElementById('barcodeTableBody');
  const newRow = tableBody.insertRow();

  newRow.insertCell(0).innerText = barcode;
  newRow.insertCell(1).innerText = date;
  newRow.insertCell(2).innerText = salesOrder;
  newRow.insertCell(3).innerText = loggedInUser;

  const deleteCell = newRow.insertCell(4);
  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.className = 'delete-btn';
  deleteButton.onclick = () => deleteBarcode(barcode, newRow);
  deleteCell.appendChild(deleteButton);

  document.getElementById('barcodeCounter').innerText = barcodes.length;

  document.getElementById('barcode').value = '';
}

function deleteBarcode(barcode, row) {
  barcodes = barcodes.filter(b => b !== barcode);
  row.remove();
  document.getElementById('barcodeCounter').innerText = barcodes.length;
}

function exportToExcel(salesOrder) {
  if (barcodes.length === 0) {
    alert("No barcodes to export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(
    barcodes.map(barcode => ({
      Barcode: `'${barcode}`,
      Date: new Date().toLocaleDateString(),
      SalesOrder: salesOrder,
      UserID: loggedInUser
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Barcodes");

  const filename = `${salesOrder}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

function searchBarcodes() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const tableRows = document.getElementById('barcodeTableBody').rows;

  for (let i = 0; i < tableRows.length; i++) {
    const row = tableRows[i];
    const barcode = row.cells[0].innerText.toLowerCase();
    
    if (barcode.includes(input)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  }
}
