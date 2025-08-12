let originalData = []; // 儲存原始資料

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('無法加載 data.json');
      }
      return response.json();
    })
    .then(data => {
      originalData = data;
      renderTable(originalData); // 初始渲染
    })
    .catch(error => {
      console.error('錯誤:', error);
      document.getElementById('gearTableBody').innerHTML = '<tr><td colspan="15">無法加載資料，請檢查 data.json</td></tr>';
    });
});

// 渲染表格
function renderTable(data) {
  const tableBody = document.getElementById('gearTableBody');
  tableBody.innerHTML = '';
  data.forEach(item => {
    const centralPurchaseDisplay = item["中央時期購入"]?.toUpperCase() === 'TRUE' ? '<span class="central-purchase">✔</span>' : '';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item["器材名稱"] || ''}</td>
      <td>${item["狀態"] || ''}</td>
      <td>${item["型號"] || ''}</td>
      <td>${item["資產類型"] || ''}</td>
      <td>${item["品牌"] || ''}</td>
      <td>${item["產編"] || ''}</td>
      <td>${item["機號"] || ''}</td>
      <td>${item["數量"] || ''}</td>
      <td>${item["領用日期"] || ''}</td>
      <td>${item["目前擁有者"] || ''}</td>
      <td>${item["狀況備註"] || ''}</td>
      <td>${centralPurchaseDisplay}</td>
      <td>${item["上一個擁有者"] || ''}</td>
      <td>${item["顏色"] || ''}</td>
      <td>${item["裝置相片"] ? `<img src="${item["裝置相片"]}" alt="${item["器材名稱"] || '器材'}" onclick="window.open('${item["裝置相片"]}', '_blank')">` : ''}</td>
    `;
    tableBody.appendChild(row);
  });
}

// 套用篩選、搜尋、排序
function applyFilters() {
  let filteredData = [...originalData];

  // 搜尋（處理空值、不分大小寫、移除空白）
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  if (searchTerm) {
    filteredData = filteredData.filter(item => 
      (item["器材名稱"] && item["器材名稱"].toLowerCase().includes(searchTerm)) ||
      (item["型號"] && item["型號"].toLowerCase().includes(searchTerm))
    );
  }

  // 篩選資產類型
  const filterType = document.getElementById('filterType').value;
  if (filterType !== 'all') {
    filteredData = filteredData.filter(item => item["資產類型"] === filterType);
  }

  // 篩選目前擁有者
  const filterOwner = document.getElementById('filterOwner').value;
  if (filterOwner !== 'all') {
    filteredData = filteredData.filter(item => item["目前擁有者"] === filterOwner);
  }

  // 排序
  const sortBy = document.getElementById('sortBy').value;
  if (sortBy) {
    const [key, direction] = sortBy.split('_');
    filteredData.sort((a, b) => {
      let valA = a[key] || '';
      let valB = b[key] || '';
      if (key === '數量') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
        return direction === 'asc' ? valA - valB : valB - valA;
      } else if (key === '領用日期') {
        valA = new Date(valA.replace(/\//g, '-')) || new Date(0);
        valB = new Date(valB.replace(/\//g, '-')) || new Date(0);
        return direction === 'asc' ? valA - valB : valB - valA;
      } else {
        // 字符串排序，支持中文
        const compare = valA.localeCompare(valB, 'zh-TW');
        return direction === 'asc' ? compare : -compare;
      }
    });
  }

  renderTable(filteredData);
}