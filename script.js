document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('stock-table-body');

  async function fetchStockData() {
    try {
      const response = await fetch('/api/stocks');
      if (!response.ok) throw new Error('Failed to fetch stock data');

      const stocks = await response.json();
      tableBody.innerHTML = '';

      stocks.forEach(stock => {
        const row = document.createElement('tr');

        const price = typeof stock.price === 'number' ? `$${stock.price.toFixed(2)}` : 'N/A';
        const change = typeof stock.change === 'number' ? stock.change.toFixed(2) : 'N/A';
        const percent = typeof stock.percentChange === 'number' ? `${stock.percentChange.toFixed(2)}%` : 'N/A';

        row.innerHTML = `
          <td>${stock.name}</td>
          <td>${stock.symbol}</td>
          <td>${price}</td>
          <td>${change}</td>
          <td>${percent}</td>
        `;

        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching stock data:', error);
      tableBody.innerHTML = `<tr><td colspan="5">⚠️ Error loading stock data</td></tr>`;
    }
  }

  fetchStockData();
  setInterval(fetchStockData, 60000);
});
