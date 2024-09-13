import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 50,
            page: 1,
          }
        });
        setCryptoData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = cryptoData.filter(crypto =>
      crypto.name.toLowerCase().includes(query) ||
      crypto.symbol.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="app">
      <h1>Cryptocurrency Price Tracker</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or symbol..."
          value={search}
          onChange={handleSearch}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
            <th>Current Price</th>
            <th>Market Cap</th>
            <th>24h Change</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(crypto => (
            <tr key={crypto.id}>
              <td><img src={crypto.image} alt={crypto.name} className="crypto-logo" /> {crypto.name}</td>
              <td>{crypto.symbol.toUpperCase()}</td>
              <td>${crypto.current_price.toFixed(2)}</td>
              <td>${crypto.market_cap.toLocaleString()}</td>
              <td className={crypto.price_change_percentage_24h < 0 ? 'negative' : 'positive'}>
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="footer">
        <p> ♠ PROJECT BY ABDUL DHANISH ♠ </p>
      </div>
    </div>
  );
};

export default App;
