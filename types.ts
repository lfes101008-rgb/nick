export interface StockAnalysis {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  peRatio: number | null; // 本益比
  dividendYield: number | null; // 殖利率
  marketStatus: 'Open' | 'Closed';
  recommendation: 'Buy' | 'Sell' | 'Hold'; // 投資建議
  recommendationReason: string; // 建議理由
  buyPrice: number | null; // 建議買進價
  sellPrice: number | null; // 建議賣出價
  analysis: string; // 綜合分析 (取代原本的文青風 trend/chip analysis)
  newsSummary: string; // 新聞與話題摘要
}

export interface RecommendedStock {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  reason: string;
}

export interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MovingAverageData extends StockDataPoint {
  ma5: number | null;
  ma20: number | null;
  ma60: number | null;
}