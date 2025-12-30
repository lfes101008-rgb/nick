import React from 'react';
import { StockAnalysis } from '../types';

interface StockSummaryProps {
  data: StockAnalysis;
  onBack: () => void;
}

const StockSummary: React.FC<StockSummaryProps> = ({ data, onBack }) => {
  const isPositive = data.change >= 0;
  const colorClass = isPositive ? 'text-[#8B0000]' : 'text-[#006400]';
  const sign = isPositive ? '+' : '';

  // Recommendation Badge Style
  const getRecStyle = (rec: string) => {
    switch (rec) {
      case 'Buy': return 'bg-red-800 text-white border-red-900';
      case 'Sell': return 'bg-green-800 text-white border-green-900';
      default: return 'bg-yellow-600 text-white border-yellow-700';
    }
  };

  const getRecText = (rec: string) => {
    switch (rec) {
      case 'Buy': return '建議買進';
      case 'Sell': return '建議賣出';
      default: return '建議續抱 / 觀望';
    }
  };

  return (
    <div className="mb-12">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm tracking-widest text-gray-500 hover:text-[#333333] transition-colors group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        返回搜尋
      </button>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-[#333333] pb-6">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-4xl font-bold tracking-wider text-[#333333]">{data.symbol}</h2>
          <p className="text-lg text-gray-600 mt-1">{data.name}</p>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="text-right">
             <div className="text-4xl font-bold tracking-tighter text-[#333333]">
              {data.price.toFixed(2)}
            </div>
            <div className={`text-sm font-bold ${colorClass}`}>
              {sign}{data.change.toFixed(2)} ({sign}{data.changePercent.toFixed(2)}%)
            </div>
           </div>
        </div>
      </div>

      {/* Recommendation Card */}
      <div className={`p-6 mb-8 rounded-lg shadow-lg border-2 ${getRecStyle(data.recommendation)}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold tracking-widest mb-1">
              {getRecText(data.recommendation)}
            </h3>
            <p className="opacity-90 text-sm font-medium tracking-wide">
              {data.recommendationReason}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded text-xs font-mono uppercase tracking-widest">
            AI Verdict
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/80 p-4 border border-[#333333] shadow-sm">
           <p className="text-xs text-gray-500 mb-1 tracking-wider uppercase">建議買進價</p>
           <p className="font-bold text-[#8B0000] text-lg">
             {data.buyPrice ? data.buyPrice.toFixed(2) : '-'}
           </p>
        </div>
        <div className="bg-white/80 p-4 border border-[#333333] shadow-sm">
           <p className="text-xs text-gray-500 mb-1 tracking-wider uppercase">建議賣出價</p>
           <p className="font-bold text-[#006400] text-lg">
             {data.sellPrice ? data.sellPrice.toFixed(2) : '-'}
           </p>
        </div>
        <div className="bg-white/60 p-4 border border-gray-300">
          <p className="text-xs text-gray-500 mb-1">成交量</p>
          <p className="font-bold text-[#333333]">{data.volume}</p>
        </div>
        <div className="bg-white/60 p-4 border border-gray-300">
          <p className="text-xs text-gray-500 mb-1">本益比 (P/E)</p>
          <p className="font-bold text-[#333333]">{data.peRatio ? data.peRatio.toFixed(2) : 'N/A'}</p>
        </div>
        <div className="bg-white/60 p-4 border border-gray-300">
          <p className="text-xs text-gray-500 mb-1">殖利率 (Yield)</p>
          <p className="font-bold text-[#333333]">{data.dividendYield ? `${data.dividendYield}%` : 'N/A'}</p>
        </div>
        <div className="bg-white/60 p-4 border border-gray-300">
          <p className="text-xs text-gray-500 mb-1">市場狀態</p>
          <p className="font-bold text-[#333333]">{data.marketStatus === 'Open' ? '交易中' : '已收盤'}</p>
        </div>
      </div>
      
      {/* News & Buzz Section - Updated to be lighter and cleaner */}
      <div className="bg-white/60 p-6 mb-8 border border-gray-400 shadow-sm">
        <h3 className="text-lg font-bold text-[#333333] mb-3 tracking-wider flex items-center gap-2 border-b border-gray-300 pb-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#555555]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
          </svg>
          話題・新聞快訊
        </h3>
        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line font-medium">
          {data.newsSummary}
        </p>
      </div>

      {/* Professional Analysis */}
      <div className="bg-white/40 p-6 border-l-4 border-[#333333]">
        <h3 className="text-lg font-bold text-[#333333] mb-4 tracking-wider flex items-center gap-2">
          綜合分析摘要
        </h3>
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
          {data.analysis}
        </div>
      </div>
    </div>
  );
};

export default StockSummary;