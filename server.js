require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.FINNHUB_API_KEY;

app.use(express.static(path.join(__dirname, 'public')));

const stocks = [
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'V', name: 'Visa' },
  { symbol: 'JNJ', name: 'Johnson & Johnson' },
  { symbol: 'WMT', name: 'Walmart' },
  { symbol: 'JPM', name: 'JPMorgan Chase' },
  { symbol: 'PG', name: 'Procter & Gamble' },
  { symbol: 'UNH', name: 'UnitedHealth' },
  { symbol: 'NVDA', name: 'NVIDIA' },
  { symbol: 'HD', name: 'Home Depot' },
  { symbol: 'VZ', name: 'Verizon' },
  { symbol: 'DIS', name: 'Disney' },
  { symbol: 'INTC', name: 'Intel' },
  { symbol: 'KO', name: 'Coca-Cola' },
  { symbol: 'MRK', name: 'Merck' },
  { symbol: 'BA', name: 'Boeing' },
  { symbol: 'CSCO', name: 'Cisco' },
  { symbol: 'PEP', name: 'PepsiCo' },
  { symbol: 'MCD', name: 'McDonald’s' },
  { symbol: 'AXP', name: 'American Express' },
  { symbol: 'IBM', name: 'IBM' },
  { symbol: 'NKE', name: 'Nike' },
  { symbol: 'GS', name: 'Goldman Sachs' },
  { symbol: 'CAT', name: 'Caterpillar' },
  { symbol: 'TRV', name: 'Travelers' },
  { symbol: 'MMM', name: '3M' },
  { symbol: 'CVX', name: 'Chevron' },
  { symbol: 'DOW', name: 'Dow' },
  { symbol: 'WBA', name: 'Walgreens Boots Alliance' },
  { symbol: 'AMGN', name: 'Amgen' }
];

async function fetchQuote(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Finnhub request failed for ${symbol}: ${response.status}`);
  }

  const data = await response.json();

  return {
    symbol,
    price: typeof data.c === 'number' ? data.c : null,
    change: typeof data.d === 'number' ? data.d : null,
    percentChange: typeof data.dp === 'number' ? data.dp : null,
    high: typeof data.h === 'number' ? data.h : null,
    low: typeof data.l === 'number' ? data.l : null,
    open: typeof data.o === 'number' ? data.o : null,
    prevClose: typeof data.pc === 'number' ? data.pc : null
  };
}

app.get('/api/stocks', async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: 'Missing FINNHUB_API_KEY in .env' });
    }

    const results = [];
    for (const stock of stocks) {
      const quote = await fetchQuote(stock.symbol);
      results.push({
        name: stock.name,
        symbol: stock.symbol,
        ...quote
      });
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    res.status(500).json({
      error: 'Failed to fetch stock data',
      details: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
