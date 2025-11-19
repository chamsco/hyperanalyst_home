import { useEffect, useRef, useState, memo, useCallback } from 'react';

const TradingChart = memo(() => {
  const canvasRef = useRef(null);
  const [currentPrice, setCurrentPrice] = useState(42850.25);
  const [priceChange, setPriceChange] = useState(0);
  const dataPointsRef = useRef([]);
  const lastUpdateRef = useRef(0);
  const gridCacheRef = useRef(null);
  const minMaxCacheRef = useRef({ min: 0, max: 0, range: 0 });

  // Initialize data points
  useEffect(() => {
    const maxPoints = 100;
    let lastPrice = 42800;
    const initialData = [];
    
    for(let i = 0; i < maxPoints; i++) {
        lastPrice += (Math.random() - 0.5) * 50;
        initialData.push(lastPrice);
    }
    dataPointsRef.current = initialData;
  }, []);

  // Cache grid drawing
  const drawGrid = useCallback((ctx, width, height) => {
    if (gridCacheRef.current) {
      ctx.putImageData(gridCacheRef.current, 0, 0);
      return;
    }

    const gridCanvas = document.createElement('canvas');
    gridCanvas.width = width;
    gridCanvas.height = height;
    const gridCtx = gridCanvas.getContext('2d');
    
    gridCtx.strokeStyle = 'rgba(100,100,100,0.1)';
    gridCtx.lineWidth = 1;
    gridCtx.beginPath();
    for (let i = 0; i < width; i += 50) {
        gridCtx.moveTo(i, 0);
        gridCtx.lineTo(i, height);
    }
    for (let i = 0; i < height; i += 50) {
        gridCtx.moveTo(0, i);
        gridCtx.lineTo(width, i);
    }
    gridCtx.stroke();
    
    gridCacheRef.current = gridCtx.getImageData(0, 0, width, height);
    ctx.putImageData(gridCacheRef.current, 0, 0);
  }, []);

  // Calculate min/max with caching
  const calculateMinMax = useCallback((dataPoints) => {
    const minVal = Math.min(...dataPoints);
    const maxVal = Math.max(...dataPoints);
    const range = maxVal - minVal;
    
    if (minMaxCacheRef.current.min !== minVal || minMaxCacheRef.current.max !== maxVal) {
      minMaxCacheRef.current = { min: minVal, max: maxVal, range };
    }
    
    return minMaxCacheRef.current;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
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

    // Reset grid cache on resize
    const handleResize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);
      gridCacheRef.current = null;
    };
    window.addEventListener('resize', handleResize);

    let lastFrameTime = 0;
    const targetFPS = 30; // Reduce from 60fps to 30fps
    const frameInterval = 1000 / targetFPS;

    const draw = (currentTime) => {
      // Throttle to target FPS
      if (currentTime - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = currentTime;

      const dataPoints = dataPointsRef.current;
      
      // Update data simulating live feed (throttled)
      const now = Date.now();
      if (now - lastUpdateRef.current > 100) { // Update every 100ms instead of every frame
        if (Math.random() > 0.7) {
            const change = (Math.random() - 0.5) * 20;
            const newPrice = dataPoints[dataPoints.length - 1] + change;
            dataPoints.push(newPrice);
            dataPoints.shift();
            setCurrentPrice(newPrice);
            setPriceChange(change);
        }
        lastUpdateRef.current = now;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw cached grid
      drawGrid(ctx, width, height);

      // Calculate min/max (cached)
      const { min: minVal, max: maxVal, range } = calculateMinMax(dataPoints);
        
      // Chart Line
      ctx.beginPath();
      ctx.strokeStyle = '#FF3333'; // Orange
      ctx.lineWidth = 2;
      
      const maxPoints = dataPoints.length;
      dataPoints.forEach((point, index) => {
          const x = (index / (maxPoints - 1)) * width;
          // Map price to height (padding 20px)
          const y = height - ((point - minVal) / range) * (height - 40) - 20;
          
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Area under curve
      const lastX = width;
      const lastY = height - ((dataPoints[dataPoints.length - 1] - minVal) / range) * (height - 40) - 20;
      ctx.lineTo(lastX, height);
      ctx.lineTo(0, height);
      ctx.fillStyle = 'rgba(255, 51, 51, 0.05)';
      ctx.fill();

      // Current Price Indicator
      ctx.beginPath();
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FF3333';
      ctx.fill();
      
      // Pulse effect (throttled)
      ctx.beginPath();
      ctx.arc(lastX, lastY, 12, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 51, 51, ${0.1 + Math.sin(now / 200) * 0.05})`;
      ctx.fill();

      animationId = requestAnimationFrame(draw);
    };

    draw(0);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [drawGrid, calculateMinMax]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] border border-ink/20 dark:border-stone/20 bg-stone/50 dark:bg-ink/50 backdrop-blur-sm rounded-lg overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" style={{ willChange: 'contents' }} />
        
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
});

TradingChart.displayName = 'TradingChart';

export default TradingChart;



