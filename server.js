const express = require('express');
const yahooFinance = require('yahoo-finance2').default;
yahooFinance.suppressNotices(['yahooSurvey']);
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Dow Jones 30 stock symbols
const symbols = [
  'AAPL', 'MSFT', 'V', 'JNJ', 'WMT', 'JPM', 'PG', 'UNH', 'NVDA', 'HD',
  'VZ', 'DIS', 'INTC', 'KO', 'MRK', 'BA', 'CSCO', 'PEP', 'MCD', 'AXP',
  'IBM', 'NKE', 'GS', 'CAT', 'TRV', 'MMM', 'CVX', 'DOW', 'WBA', 'AMGN'
];

// API route to fetch stock data
app.get('/api/stocks', async (req, res) => {
  try {
    // Fetch stock quotes for all symbols
    const quotes = await Promise.all(symbols.map(symbol => yahooFinance.quote(symbol)));

    // Format stock data
    const stockData = quotes.map(quote => ({
      name: quote.displayName || quote.shortName || quote.symbol, // Fallback to symbol if names are missing
      price: quote.regularMarketPrice || "N/A" // Handle missing price data
    }));

    res.json(stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Serve the index.html on the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});