document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('stock-table-body');

  // Function to fetch and display stock data
  const fetchStockData = async () => {
    try {
      const response = await fetch('/api/stocks');
      if (!response.ok) throw new Error("Failed to fetch stock data");

      const stocks = await response.json();
      tableBody.innerHTML = ''; // Clear existing data

      stocks.forEach(stock => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${stock.name}</td><td>$${stock.price.toFixed(2)}</td>`;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching stock data:', error);
      tableBody.innerHTML = `<tr><td colspan="2">⚠️ Error loading stock data</td></tr>`;
    }
  };

  // Fetch stock data when the page loads
  fetchStockData();

  // Refresh stock data every 30 seconds
  setInterval(fetchStockData, 30000);
});