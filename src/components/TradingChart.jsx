import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const TradingChart = () => {
  const canvasRef = useRef(null);
  const [currentPrice, setCurrentPrice] = useState(42850.25);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    
    // Set display size (css pixels).
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    // Set actual size in memory (scaled to account for extra pixel density).
    const scale = window.devicePixelRatio; 
    canvas.width = width * scale;
    canvas.height = height * scale;

    // Normalize coordinate system to use css pixels.
    ctx.scale(scale, scale);

    // Data generation
    const dataPoints = [];
    const maxPoints = 100;
    let lastPrice = 42800;
    
    for(let i = 0; i < maxPoints; i++) {
        lastPrice += (Math.random() - 0.5) * 50;
        dataPoints.push(lastPrice);
    }

    const draw = () => {
        // Update data simulating live feed
        if (Math.random() > 0.9) {
            const change = (Math.random() - 0.5) * 20;
            const newPrice = dataPoints[dataPoints.length - 1] + change;
            dataPoints.push(newPrice);
            dataPoints.shift();
            setCurrentPrice(newPrice);
            setPriceChange(change);
        }

        ctx.clearRect(0, 0, width, height);

        // Grid
        ctx.strokeStyle = 'rgba(100,100,100,0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < width; i += 50) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
        }
        for (let i = 0; i < height; i += 50) {
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
        }
        ctx.stroke();

        // Chart Line
        const minVal = Math.min(...dataPoints);
        const maxVal = Math.max(...dataPoints);
        const range = maxVal - minVal;
        
        ctx.beginPath();
        ctx.strokeStyle = '#FF3333'; // Orange
        ctx.lineWidth = 2;
        
        dataPoints.forEach((point, index) => {
            const x = (index / (maxPoints - 1)) * width;
            // Map price to height (padding 20px)
            const y = height - ((point - minVal) / range) * (height - 40) - 20;
            
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Area under curve
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fillStyle = 'rgba(255, 51, 51, 0.05)';
        ctx.fill();

        // Current Price Indicator
        const lastPoint = dataPoints[dataPoints.length - 1];
        const lastY = height - ((lastPoint - minVal) / range) * (height - 40) - 20;
        
        ctx.beginPath();
        ctx.arc(width, lastY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#FF3333';
        ctx.fill();
        
        // Pulse effect
        ctx.beginPath();
        ctx.arc(width, lastY, 12, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 51, 51, ${0.1 + Math.sin(Date.now() / 200) * 0.05})`;
        ctx.fill();

        animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] border border-ink/20 dark:border-stone/20 bg-stone/50 dark:bg-ink/50 backdrop-blur-sm rounded-lg overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />
        
        {/* Overlay Info */}
        <div className="absolute top-4 left-4 font-mono text-xs md:text-sm">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange rounded-full animate-pulse"></div>
                <span className="text-orange font-bold">LIVE FEED // BTC-USD-PERP</span>
            </div>
            <div className="text-2xl font-bold text-ink dark:text-stone">
                {currentPrice.toFixed(2)} <span className="text-xs text-ink/50 dark:text-stone/50">USD</span>
            </div>
            <div className={`${priceChange >= 0 ? 'text-green-500' : 'text-orange'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({(priceChange/currentPrice * 100).toFixed(4)}%)
            </div>
        </div>

        <div className="absolute bottom-4 right-4 font-mono text-[10px] text-ink/40 dark:text-stone/40 text-right">
            <div>VOL: 42.8M</div>
            <div>24H HIGH: {(currentPrice * 1.05).toFixed(2)}</div>
            <div>24H LOW: {(currentPrice * 0.95).toFixed(2)}</div>
        </div>
    </div>
  );
};

export default TradingChart;



