import React, { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { StockDataPoint } from '../types';
import { calculateMovingAverages } from '../utils/indicators';

interface StockChartProps {
  data: StockDataPoint[];
}

// Minimalist Colors
const COLOR_PRICE = "#333333";
const COLOR_MA5 = "#8B4513";  // SaddleBrown
const COLOR_MA20 = "#556B2F"; // DarkOliveGreen
const COLOR_MA60 = "#4682B4"; // SteelBlue

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const stockData = payload[0].payload;
    return (
      <div className="bg-[#F5F5DC] border border-[#333333] p-3 text-xs shadow-none">
        <p className="font-bold mb-2 tracking-widest border-b border-[#333333] pb-1">{label}</p>
        <div className="space-y-1 font-serif text-[#333333]">
          <p>收盤：{stockData.close}</p>
          <p>開盤：{stockData.open}</p>
          <p>最高：{stockData.high}</p>
          <p>最低：{stockData.low}</p>
        </div>
      </div>
    );
  }
  return null;
};

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const chartData = useMemo(() => calculateMovingAverages(data), [data]);
  
  const allPrices = data.flatMap(d => [d.low, d.high]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const domainMin = Math.floor(minPrice * 0.98);
  const domainMax = Math.ceil(maxPrice * 1.02);

  return (
    <div className="w-full h-[350px] mt-8 mb-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {/* Subtle Grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#D3D3C5" vertical={false} />
          
          <XAxis 
            dataKey="date" 
            stroke="#666" 
            tick={{fontSize: 10, fontFamily: 'Noto Serif TC'}} 
            tickFormatter={(value) => value.slice(5)}
            axisLine={false}
            tickLine={false}
            minTickGap={40}
          />
          <YAxis 
            domain={[domainMin, domainMax]} 
            stroke="#666" 
            tick={{fontSize: 10, fontFamily: 'Noto Serif TC'}} 
            orientation="right"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Moving Averages - Thin lines */}
          <Line type="monotone" dataKey="ma5" stroke={COLOR_MA5} dot={false} strokeWidth={1} isAnimationActive={false} />
          <Line type="monotone" dataKey="ma20" stroke={COLOR_MA20} dot={false} strokeWidth={1} isAnimationActive={false} />
          <Line type="monotone" dataKey="ma60" stroke={COLOR_MA60} dot={false} strokeWidth={1} isAnimationActive={false} />

          {/* Price Line - Dark simple line */}
           <Line 
            type="monotone" 
            dataKey="close" 
            stroke={COLOR_PRICE} 
            strokeWidth={1.5} 
            dot={false}
            isAnimationActive={true}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
