// 讀取 JSON 資料
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('tableBody');
        displayData(data); // 初始顯示所有資料

        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredData = data.filter(item => {
                return Object.values(item).some(value => 
                    value.toString().toLowerCase().includes(searchTerm)
                );
            });
            displayData(filteredData);
        });
    })
    .catch(error => console.error('Error loading data:', error));

// 顯示資料到表格的函數
function displayData(items) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // 清空表格
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.status}</td>
            <td>${item.model}</td>
            <td>${item.type}</td>
            <td>${item.brand}</td>
            <td>${item.assetNumber}</td>
            <td>${item.machineNumber}</td>
            <td>${item.quantity}</td>
            <td>${item.receiptDate}</td>
            <td>${item.currentOwner}</td>
            <td>${item.notes}</td>
            <td>${item.purchasePeriod}</td>
            <td>${item.previousOwner}</td>
            <td>${item.color}</td>
            <td><img src="${item.photo}" alt="相片"></td>
        `;
        tableBody.appendChild(row);
    });
}