import { useEffect, useRef, useState, memo, useCallback } from 'react';

// Define models with different performance characteristics
const MODELS = [
  { id: 'HA-1', name: 'HA-1', color: '#FF3333', opacity: 1, lineWidth: 3, highlighted: true },
  { id: 'GPT-4', name: 'GPT-4', color: '#8B5CF6', opacity: 0.3, lineWidth: 1.5, highlighted: false },
  { id: 'Claude', name: 'Claude', color: '#F59E0B', opacity: 0.3, lineWidth: 1.5, highlighted: false },
  { id: 'Mistral', name: 'Mistral', color: '#3B82F6', opacity: 0.3, lineWidth: 1.5, highlighted: false },
  { id: 'Baseline', name: 'Baseline', color: '#6B7280', opacity: 0.2, lineWidth: 1, highlighted: false, dashed: true }
];

const ModelComparisonChart = memo(() => {
  const canvasRef = useRef(null);
  const [hoveredModel, setHoveredModel] = useState('HA-1');
  const [hoverX, setHoverX] = useState(null);
  const dataPointsRef = useRef({});
  const gridCacheRef = useRef(null);

  // Initialize mock data for each model
  useEffect(() => {
    const maxPoints = 200;
    const startValue = 10000;
    
    MODELS.forEach(model => {
      const dataPoints = [];
      let lastValue = startValue;
      const volatility = model.highlighted ? 0.02 : 0.03; // HA-1 is more stable
      const trend = model.highlighted ? 0.001 : (Math.random() - 0.5) * 0.0005; // HA-1 has positive trend
      
      for (let i = 0; i < maxPoints; i++) {
        const randomChange = (Math.random() - 0.5) * volatility;
        const trendChange = trend * i;
        lastValue = lastValue * (1 + randomChange + trendChange);
        dataPoints.push(Math.max(5000, lastValue)); // Floor at 5000
      }
      
      dataPointsRef.current[model.id] = dataPoints;
    });
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const scale = window.devicePixelRatio;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

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
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const draw = (currentTime) => {
      if (currentTime - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = currentTime;

      ctx.clearRect(0, 0, width, height);
      drawGrid(ctx, width, height);

      // Calculate global min/max across all models
      let globalMin = Infinity;
      let globalMax = -Infinity;
      
      MODELS.forEach(model => {
        const dataPoints = dataPointsRef.current[model.id] || [];
        if (dataPoints.length > 0) {
          globalMin = Math.min(globalMin, ...dataPoints);
          globalMax = Math.max(globalMax, ...dataPoints);
        }
      });

      const range = globalMax - globalMin;
      const padding = 40;
      const chartHeight = height - padding * 2;
      const chartWidth = width - padding * 2;

      // Draw models (highlighted first, then others)
      const sortedModels = [...MODELS].sort((a, b) => {
        if (a.highlighted) return -1;
        if (b.highlighted) return 1;
        return 0;
      });

      sortedModels.forEach(model => {
        const dataPoints = dataPointsRef.current[model.id] || [];
        if (dataPoints.length === 0) return;

        ctx.save();
        ctx.globalAlpha = model.opacity;
        
        if (model.dashed) {
          ctx.setLineDash([5, 5]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.strokeStyle = model.color;
        ctx.lineWidth = model.lineWidth;
        ctx.beginPath();

        dataPoints.forEach((point, index) => {
          const x = padding + (index / (dataPoints.length - 1)) * chartWidth;
          const y = height - padding - ((point - globalMin) / range) * chartHeight;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });

        ctx.stroke();
        ctx.restore();
      });

      // Draw hover indicator
      if (hoverX !== null && hoverX >= padding && hoverX <= width - padding) {
        const model = MODELS.find(m => m.id === hoveredModel);
        const dataPoints = dataPointsRef.current[hoveredModel] || [];
        
        if (dataPoints.length > 0) {
          const index = Math.round(((hoverX - padding) / chartWidth) * (dataPoints.length - 1));
          const clampedIndex = Math.max(0, Math.min(dataPoints.length - 1, index));
          const value = dataPoints[clampedIndex];
          const y = height - padding - ((value - globalMin) / range) * chartHeight;

          // Vertical line
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(hoverX, padding);
          ctx.lineTo(hoverX, height - padding);
          ctx.stroke();
          ctx.setLineDash([]);

          // Value indicator
          ctx.fillStyle = model?.color || '#FF3333';
          ctx.beginPath();
          ctx.arc(hoverX, y, 4, 0, Math.PI * 2);
          ctx.fill();

          // Value label
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(hoverX - 40, y - 25, 80, 20);
          ctx.fillStyle = '#fff';
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`$${value.toFixed(2)}`, hoverX, y - 10);
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw(0);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [drawGrid, hoveredModel, hoverX]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setHoverX(e.clientX - rect.left);
    }
  };

  const handleMouseLeave = () => {
    setHoverX(null);
  };

  // Get current values for legend
  const getCurrentValue = (modelId) => {
    const dataPoints = dataPointsRef.current[modelId] || [];
    return dataPoints.length > 0 ? dataPoints[dataPoints.length - 1] : 0;
  };

  return (
    <div className="relative w-full border border-ink/20 dark:border-stone/20 bg-stone/50 dark:bg-ink/50 backdrop-blur-sm rounded-lg overflow-hidden">
      {/* Chart Header */}
      <div className="absolute top-4 left-4 z-10">
        <h2 className="font-serif text-xl md:text-2xl font-bold text-ink dark:text-stone mb-2">
          TOTAL ACCOUNT VALUE
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange rounded-full animate-pulse"></div>
          <span className="font-mono text-xs text-orange">LIVE</span>
        </div>
      </div>

      {/* Time Range Buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button className="px-3 py-1 text-xs font-mono border border-ink/20 dark:border-stone/20 bg-stone/80 dark:bg-ink/80 text-ink dark:text-stone hover:bg-orange hover:text-stone transition-colors">
          ALL
        </button>
        <button className="px-3 py-1 text-xs font-mono border border-ink/20 dark:border-stone/20 bg-stone/80 dark:bg-ink/80 text-ink dark:text-stone hover:bg-orange hover:text-stone transition-colors">
          72H
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-[500px] md:h-[600px]"
        style={{ willChange: 'contents' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Model Legend */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        {MODELS.map((model) => {
          const currentValue = getCurrentValue(model.id);
          return (
            <div
              key={model.id}
              className={`flex items-center gap-2 px-3 py-2 rounded border backdrop-blur-sm transition-all cursor-pointer ${
                model.highlighted
                  ? 'bg-orange/20 border-orange/50 shadow-lg scale-105'
                  : 'bg-stone/50 dark:bg-ink/50 border-ink/20 dark:border-stone/20 opacity-50 hover:opacity-75'
              }`}
              onMouseEnter={() => setHoveredModel(model.id)}
              style={{
                borderColor: model.highlighted ? model.color : undefined
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: model.color,
                  opacity: model.highlighted ? 1 : 0.5
                }}
              />
              <span className="font-mono text-xs font-bold text-ink dark:text-stone">
                {model.name}
              </span>
              <span className="font-mono text-xs text-ink/70 dark:text-stone/70">
                ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

ModelComparisonChart.displayName = 'ModelComparisonChart';

export default ModelComparisonChart;

