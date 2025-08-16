import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import stocksData from '../data/stocks.json';

const Analysis: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const [stock, setStock] = useState<any>(null);

  useEffect(() => {
    const foundStock = stocksData.find((s) => s.ticker === ticker);
    setStock(foundStock || null);
  }, [ticker]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (document.querySelector('input') as HTMLInputElement)?.value.toUpperCase();
    const foundStock = stocksData.find((s) => s.ticker === input);
    setStock(foundStock || null);
  };

  return (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-blue-300">Phân tích Doanh nghiệp</h2>
      <p className="mb-6 text-gray-300">Báo cáo phân tích chuyên sâu.</p>
      <form onSubmit={handleSearch} className="mb-6 flex items-center">
        <input
          type="text"
          placeholder="Nhập mã chứng khoán, ví dụ: VIC"
          className="p-3 bg-gray-800 rounded-l-lg w-full text-white border-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 transition duration-300"
        >
          Tìm kiếm
        </button>
      </form>
      {stock ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-6 border-b-2 border-blue-700 pb-4">
            <h3 className="text-2xl font-bold text-white">{stock.name} ({stock.ticker})</h3>
            <p className="text-gray-400">Ngành: {stock.sector}</p>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold text-blue-300 mb-4">Chỉ số Tài chính Cốt lõi</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-400">P/E</p>
                <p className="text-lg font-bold">{stock.pe}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-400">EPS</p>
                <p className="text-lg font-bold">{stock.eps}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-400">ROE</p>
                <p className="text-lg font-bold">{stock.roe}%</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Market Cap</p>
                <p className="text-lg font-bold">{stock.marketCap}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold text-blue-300 mb-4">Khuyến nghị & Tín hiệu</h4>
            <p className="text-lg font-bold text-green-400 mb-2"><strong>Khuyến nghị:</strong> {stock.recommendation}</p>
            <p className="text-gray-300"><strong>Tín hiệu:</strong> {stock.signals.join(', ')}</p>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold text-blue-300 mb-4">Mục tiêu Giá</h4>
            <p className="text-gray-300"><strong>Giá mục tiêu:</strong> {stock.targetPrice}</p>
            <p className="text-gray-300"><strong>Giá hiện tại:</strong> {stock.currentPrice}</p>
            <p className="text-gray-300"><strong>Chiết khấu:</strong> {stock.discount}%</p>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold text-blue-300 mb-4">Phân tích Chi tiết</h4>
            <p className="text-gray-300 mb-2"><strong>Phân tích cơ bản:</strong> {stock.fundamentalAnalysis}</p>
            <p className="text-gray-300"><strong>Phân tích kỹ thuật:</strong> {stock.technicalAnalysis}</p>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-blue-300 mb-4">Mô tả</h4>
            <p className="text-gray-300">{stock.description}</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-gray-200 text-center">Hãy nhập mã cổ phiếu để xem báo cáo phân tích.</p>
        </div>
      )}
    </div>
  );
};

export default Analysis;