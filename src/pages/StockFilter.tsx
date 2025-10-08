'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import stocksData from '../data/stocks.json';

const StockFilter: React.FC = () => {
  const [filteredStocks, setFilteredStocks] = useState(stocksData);
  const [filters, setFilters] = useState({
    pe: '',
    eps: '',
    roe: '',
    be: '',
    peAvg: '',
    sector: 'All',
  });
  const router = useRouter();

  useEffect(() => {
    const applyFilters = () => {
      let result = stocksData;

      if (filters.pe) result = result.filter(stock => stock.pe <= parseFloat(filters.pe));
      if (filters.eps) result = result.filter(stock => stock.eps >= parseFloat(filters.eps));
      if (filters.roe) result = result.filter(stock => stock.roe >= parseFloat(filters.roe));
      if (filters.be) result = result.filter(stock => stock.be <= parseFloat(filters.be));
      if (filters.peAvg) result = result.filter(stock => stock.peAvg <= parseFloat(filters.peAvg));
      if (filters.sector !== 'All') result = result.filter(stock => stock.sector === filters.sector);

      setFilteredStocks(result);
    };

    applyFilters();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({ pe: '', eps: '', roe: '', be: '', peAvg: '', sector: 'All' });
    setFilteredStocks(stocksData);
  };

  const handleView = (ticker: string) => {
    router.push(`/analysis/${ticker}`);
  };

  return (
    <div className="bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-300">Bộ lọc cổ phiếu</h2>
      <p className="mb-4 text-gray-200">Nhập tiêu chí để lọc (điều kiện mặc định).</p>
      <div className="grid grid-cols-6 gap-4 mb-4">
        <input
          type="text"
          name="pe"
          placeholder="P/E ≤ e.g. 15"
          value={filters.pe}
          onChange={handleFilterChange}
          className="p-2 bg-gray-800 rounded text-white"
        />
        <input
          type="text"
          name="eps"
          placeholder="EPS ≥ e.g. 4000"
          value={filters.eps}
          onChange={handleFilterChange}
          className="p-2 bg-gray-800 rounded text-white"
        />
        <input
          type="text"
          name="roe"
          placeholder="ROE ≥ e.g. 15"
          value={filters.roe}
          onChange={handleFilterChange}
          className="p-2 bg-gray-800 rounded text-white"
        />
        <input
          type="text"
          name="be"
          placeholder="B/E ≤ e.g. 15"
          value={filters.be}
          onChange={handleFilterChange}
          className="p-2 bg-gray-800 rounded text-white"
        />
        <input
          type="text"
          name="peAvg"
          placeholder="P/E average ≤ e.g. 15"
          value={filters.peAvg}
          onChange={handleFilterChange}
          className="p-2 bg-gray-800 rounded text-white"
        />
        <select
          name="sector"
          value={filters.sector}
          onChange={handleFilterChange}
          className="p-2 bg-gray-800 rounded text-white"
        >
          <option value="All">All</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Retail">Retail</option>
          <option value="IT">IT</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Finance">Finance</option>
        </select>
      </div>
      <button
        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded mr-2"
        onClick={() => {}}
      >
        Run
      </button>
      <button
        className="bg-gray-600 text-white px-4 py-2 rounded"
        onClick={handleReset}
      >
        Reset
      </button>
      <div className="mt-4">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2">Mã</th>
              <th className="p-2">Tên</th>
              <th className="p-2">EPS</th>
              <th className="p-2">ROE</th>
              <th className="p-2">B/E</th>
              <th className="p-2">P/E Avg</th>
              <th className="p-2">Market Cap</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => (
              <tr key={stock.ticker} className="bg-gray-700 hover:bg-gray-600 transition-colors">
                <td className="p-2">{stock.ticker}</td>
                <td className="p-2">{stock.name}</td>
                <td className="p-2">{stock.eps}</td>
                <td className="p-2">{stock.roe}%</td>
                <td className="p-2">{stock.be}</td>
                <td className="p-2">{stock.peAvg}</td>
                <td className="p-2">{stock.marketCap}</td>
                <td className="p-2"><button className="text-blue-400" onClick={() => handleView(stock.ticker)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockFilter;