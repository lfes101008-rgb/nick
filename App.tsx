import React, { useState, useEffect } from 'react';
import { fetchStockData, fetchRecommendations } from './services/geminiService';
import { StockAnalysis, RecommendedStock } from './types';
import StockSummary from './components/StockSummary';

const App: React.FC = () => {
  const [ticker, setTicker] = useState<string>('');
  const [data, setData] = useState<StockAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedStock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [recLoading, setRecLoading] = useState<boolean>(false);
  
  // Time Logic
  const [appTitle, setAppTitle] = useState<string>("台股戰情室");
  
  useEffect(() => {
    const updateTitle = () => {
      const now = new Date();
      const day = now.getDay(); // 0 is Sun, 6 is Sat
      const hour = now.getHours();
      const minute = now.getMinutes();
      const time = hour * 100 + minute;

      const isWeekend = day === 0 || day === 6;
      const isMarketTime = !isWeekend && time >= 900 && time < 1330;

      setAppTitle(isMarketTime ? "今日盤中掃描" : "明日趨勢展望");
    };
    
    updateTitle();
    const timer = setInterval(updateTitle, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Recommendations on Mount
  useEffect(() => {
    const getRecs = async () => {
      setRecLoading(true);
      try {
        const recs = await fetchRecommendations();
        setRecommendations(recs);
      } catch (e) {
        console.error("Failed to fetch recommendations");
      } finally {
        setRecLoading(false);
      }
    };
    getRecs();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) return;

    setLoading(true);
    setData(null);

    try {
      const result = await fetchStockData(ticker);
      setData(result);
    } catch (err) {
      alert("查無資料，請確認代號。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-0">
      <div className="max-w-3xl mx-auto pt-16">
        
        {/* Header - Professional Clean Style */}
        <header className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] text-gray-500 mb-2 uppercase">Professional Stock Analysis</p>
          <h1 className="text-3xl font-bold text-[#333333] tracking-wide">
            {appTitle}
          </h1>
        </header>

        {/* Search Input - Clean & Functional */}
        {!data && (
          <div className="flex justify-center mb-12">
            <form onSubmit={handleSearch} className="relative w-full max-w-sm">
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="輸入股票代號 (如 2330)"
                className="w-full bg-white border border-gray-400 py-3 px-6 text-lg text-center text-[#333333] placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm rounded-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 px-4 bg-gray-800 text-white hover:bg-black transition-colors disabled:opacity-50"
              >
                {loading ? "..." : "分析"}
              </button>
            </form>
          </div>
        )}

        {/* Main Content Area */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
            <p className="tracking-widest text-sm">正在進行多維度分析...</p>
          </div>
        )}

        {data && !loading && (
          <div className="animate-[fadeIn_0.5s_ease-out]">
            <StockSummary data={data} onBack={() => setData(null)} />
          </div>
        )}

        {/* AI Recommendations Section */}
        {!data && !loading && (
          <div className="mt-8 animate-[fadeIn_0.8s_ease-out]">
             <div className="flex items-center gap-4 mb-6">
                <div className="h-4 w-1 bg-[#333333]"></div>
                <h3 className="text-xl font-bold text-[#333333] tracking-wide">市場焦點・強勢精選</h3>
             </div>

             {recLoading ? (
               <div className="py-12 text-center text-sm text-gray-400 tracking-wider">
                 AI 正在掃描全市場數據...
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {recommendations.map((stock) => (
                   <div 
                    key={stock.symbol} 
                    className="bg-white p-6 border border-gray-200 hover:border-[#333333] hover:shadow-lg transition-all cursor-pointer group" 
                    onClick={() => { setTicker(stock.symbol); handleSearch({preventDefault: () => {}} as any); }}
                   >
                     <div className="flex justify-between items-start mb-3">
                       <div>
                         <h4 className="text-xl font-bold group-hover:text-[#8B0000] transition-colors">{stock.symbol}</h4>
                         <p className="text-sm text-gray-500">{stock.name}</p>
                       </div>
                       <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1">
                         +{stock.changePercent}%
                       </span>
                     </div>
                     <p className="text-sm text-gray-700 leading-snug border-t border-gray-100 pt-3">
                       {stock.reason}
                     </p>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
        
        {/* Footer */}
        <footer className="mt-24 text-center text-xs text-gray-400 tracking-wider border-t border-gray-300 pt-8 pb-8">
          AI Investment Assistant © 2024 | 投資一定有風險，申購前請詳閱公開說明書
        </footer>

      </div>
    </div>
  );
};

export default App;