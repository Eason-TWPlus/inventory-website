// 全域變數
let inventoryData = [];

// 載入資料：先從 localStorage，如果沒有則從 JSON
function loadData() {
    const storedData = localStorage.getItem('inventoryData');
    if (storedData) {
        inventoryData = JSON.parse(storedData);
    } else {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                inventoryData = data;
                saveData();
                displayData(inventoryData);
            })
            .catch(error => console.error('Error loading data:', error));
    }
    displayData(inventoryData);
}

// 保存到 localStorage
function saveData() {
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
}

// 顯示資料
function displayData(items) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    items.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.器材名稱}</td>
            <td>${item.狀態}</td>
            <td>${item.型號}</td>
            <td>${item.資產類型}</td>
            <td>${item.品牌}</td>
            <td>${item.財產編號}</td>
            <td>${item.機號}</td>
            <td>${item.數量}</td>
            <td>${item.領用日期}</td>
            <td>${item.目前擁有者}</td>
            <td>${item.備註}</td>
            <td>${item.中央時期購入}</td>
            <td>${item.上一個擁有者}</td>
            <td>${item.顏色}</td>
            <td><img src="${item.裝置相片}" alt="相片"></td>
            <td>
                <button onclick="editItem(${index})">編輯</button>
                <button onclick="deleteItem(${index})">刪除</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 搜索功能
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = inventoryData.filter(item => {
        return Object.values(item).some(value => 
            value.toString().toLowerCase().includes(searchTerm)
        );
    });
    displayData(filteredData);
});

// 編輯項目
function editItem(index) {
    const item = inventoryData[index];
    const form = document.getElementById('editForm');
    Object.keys(item).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) input.value = item[key];
    });
    document.getElementById('editModal').style.display = 'block';

    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const updatedItem = {};
        formData.forEach((value, key) => { updatedItem[key] = value; });
        inventoryData[index] = updatedItem;
        saveData();
        displayData(inventoryData);
        closeModal();
        return false;
    };
}

// 刪除項目
function deleteItem(index) {
    if (confirm('確定刪除？')) {
        inventoryData.splice(index, 1);
        saveData();
        displayData(inventoryData);
    }
}

// 新增項目
document.getElementById('addButton').addEventListener('click', () => {
    const form = document.getElementById('editForm');
    form.reset(); // 清空表單
    document.getElementById('editModal').style.display = 'block';

    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const newItem = {};
        formData.forEach((value, key) => { newItem[key] = value; });
        inventoryData.push(newItem);
        saveData();
        displayData(inventoryData);
        closeModal();
        return false;
    };
});

// 關閉模態
document.getElementById('cancelButton').addEventListener('click', closeModal);
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// 初始載入
loadData();
