'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ============================================================================
// Types
// ============================================================================

export type ChartType = 'line' | 'bar' | 'area' | 'donut';

export interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
    fill?: boolean;
  }[];
}

export interface ChartProps {
  data: ChartData;
  type?: ChartType;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
  className?: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toFixed(0);
}

function getDefaultColors(): string[] {
  return [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
  ];
}

// ============================================================================
// Line/Area Chart Component
// ============================================================================

interface LineChartProps extends Omit<ChartProps, 'type'> {
  filled?: boolean;
}

function LineChart({
  data,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  animate = true,
  filled = false,
  className = '',
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; value: number; label: string } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [height]);

  const colors = getDefaultColors();
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = dimensions.width - padding.left - padding.right;
  const chartHeight = dimensions.height - padding.top - padding.bottom;

  const allValues = data.datasets.flatMap((d) => d.data);
  const maxValue = Math.max(...allValues) * 1.1;
  const minValue = Math.min(0, ...allValues);

  const xScale = useCallback(
    (index: number) => padding.left + (index / (data.labels.length - 1)) * chartWidth,
    [chartWidth, data.labels.length, padding.left]
  );

  const yScale = useCallback(
    (value: number) =>
      padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight,
    [chartHeight, maxValue, minValue, padding.top]
  );

  const createPath = useCallback(
    (values: number[]): string => {
      return values
        .map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`)
        .join(' ');
    },
    [xScale, yScale]
  );

  const createAreaPath = useCallback(
    (values: number[]): string => {
      const linePath = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ');
      const lastIndex = values.length - 1;
      return `${linePath} L ${xScale(lastIndex)} ${yScale(0)} L ${xScale(0)} ${yScale(0)} Z`;
    },
    [xScale, yScale]
  );

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const tickCount = 5;
    const step = (maxValue - minValue) / tickCount;
    return Array.from({ length: tickCount + 1 }, (_, i) => minValue + i * step);
  }, [maxValue, minValue]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg width={dimensions.width} height={dimensions.height}>
        {/* Grid */}
        {showGrid && (
          <g className="text-gray-200 dark:text-gray-700">
            {yTicks.map((tick, i) => (
              <line
                key={i}
                x1={padding.left}
                y1={yScale(tick)}
                x2={dimensions.width - padding.right}
                y2={yScale(tick)}
                stroke="currentColor"
                strokeDasharray="4,4"
              />
            ))}
          </g>
        )}

        {/* Y-axis labels */}
        <g className="text-xs text-gray-500 dark:text-gray-400">
          {yTicks.map((tick, i) => (
            <text
              key={i}
              x={padding.left - 10}
              y={yScale(tick)}
              textAnchor="end"
              alignmentBaseline="middle"
              fill="currentColor"
            >
              {formatNumber(tick)}
            </text>
          ))}
        </g>

        {/* X-axis labels */}
        <g className="text-xs text-gray-500 dark:text-gray-400">
          {data.labels.map((label, i) => (
            <text
              key={i}
              x={xScale(i)}
              y={dimensions.height - 10}
              textAnchor="middle"
              fill="currentColor"
            >
              {label}
            </text>
          ))}
        </g>

        {/* Dataset lines/areas */}
        {data.datasets.map((dataset, datasetIndex) => {
          const color = dataset.color || colors[datasetIndex % colors.length];
          return (
            <g key={datasetIndex}>
              {(filled || dataset.fill) && (
                <path
                  d={createAreaPath(dataset.data)}
                  fill={color}
                  fillOpacity={0.1}
                  className={animate ? 'animate-fade-in' : ''}
                />
              )}
              <path
                d={createPath(dataset.data)}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={animate ? 'animate-draw-line' : ''}
              />
              {/* Data points */}
              {dataset.data.map((value, i) => (
                <circle
                  key={i}
                  cx={xScale(i)}
                  cy={yScale(value)}
                  r={4}
                  fill={color}
                  className="cursor-pointer hover:r-6 transition-all"
                  onMouseEnter={() =>
                    setHoveredPoint({
                      x: xScale(i),
                      y: yScale(value),
                      value,
                      label: data.labels[i],
                    })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {showTooltip && hoveredPoint && (
        <div
          className="absolute pointer-events-none bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg"
          style={{
            left: hoveredPoint.x,
            top: hoveredPoint.y - 30,
            transform: 'translateX(-50%)',
          }}
        >
          {hoveredPoint.label}: {formatNumber(hoveredPoint.value)}
        </div>
      )}

      {/* Legend */}
      {showLegend && data.datasets.length > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          {data.datasets.map((dataset, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dataset.color || colors[i % colors.length] }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{dataset.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Bar Chart Component
// ============================================================================

function BarChart({
  data,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  animate = true,
  className = '',
}: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBar, setHoveredBar] = useState<{ x: number; y: number; value: number; label: string } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [height]);

  const colors = getDefaultColors();
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = dimensions.width - padding.left - padding.right;
  const chartHeight = dimensions.height - padding.top - padding.bottom;

  const allValues = data.datasets.flatMap((d) => d.data);
  const maxValue = Math.max(...allValues) * 1.1;

  const barGroupWidth = chartWidth / data.labels.length;
  const barWidth = (barGroupWidth * 0.8) / data.datasets.length;
  const barGap = barGroupWidth * 0.1;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg width={dimensions.width} height={dimensions.height}>
        {/* Bars */}
        {data.datasets.map((dataset, datasetIndex) => {
          const color = dataset.color || colors[datasetIndex % colors.length];
          return (
            <g key={datasetIndex}>
              {dataset.data.map((value, i) => {
                const barHeight = (value / maxValue) * chartHeight;
                const x = padding.left + barGap + i * barGroupWidth + datasetIndex * barWidth;
                const y = padding.top + chartHeight - barHeight;

                return (
                  <rect
                    key={i}
                    x={x}
                    y={animate ? padding.top + chartHeight : y}
                    width={barWidth - 2}
                    height={animate ? 0 : barHeight}
                    fill={color}
                    rx={4}
                    className={`cursor-pointer hover:opacity-80 transition-all ${
                      animate ? 'animate-grow-bar' : ''
                    }`}
                    style={{
                      animationDelay: `${i * 50}ms`,
                    }}
                    onMouseEnter={() =>
                      setHoveredBar({
                        x: x + barWidth / 2,
                        y,
                        value,
                        label: data.labels[i],
                      })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                );
              })}
            </g>
          );
        })}

        {/* X-axis labels */}
        <g className="text-xs text-gray-500 dark:text-gray-400">
          {data.labels.map((label, i) => (
            <text
              key={i}
              x={padding.left + barGap + i * barGroupWidth + (barGroupWidth - barGap * 2) / 2}
              y={dimensions.height - 10}
              textAnchor="middle"
              fill="currentColor"
            >
              {label}
            </text>
          ))}
        </g>
      </svg>

      {/* Tooltip */}
      {showTooltip && hoveredBar && (
        <div
          className="absolute pointer-events-none bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg"
          style={{
            left: hoveredBar.x,
            top: hoveredBar.y - 30,
            transform: 'translateX(-50%)',
          }}
        >
          {hoveredBar.label}: {formatNumber(hoveredBar.value)}
        </div>
      )}

      {/* Legend */}
      {showLegend && data.datasets.length > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          {data.datasets.map((dataset, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: dataset.color || colors[i % colors.length] }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{dataset.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Donut Chart Component
// ============================================================================

interface DonutChartProps {
  data: DataPoint[];
  size?: number;
  thickness?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  animate?: boolean;
  className?: string;
}

export function DonutChart({
  data,
  size = 200,
  thickness = 40,
  showLegend = true,
  showLabels = true,
  animate = true,
  className = '',
}: DonutChartProps) {
  const colors = getDefaultColors();
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = size / 2;
  const innerRadius = radius - thickness;

  let currentAngle = -90;

  const segments = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);

    const x3 = radius + innerRadius * Math.cos(endRad);
    const y3 = radius + innerRadius * Math.sin(endRad);
    const x4 = radius + innerRadius * Math.cos(startRad);
    const y4 = radius + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    const path = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;

    return {
      ...d,
      path,
      color: d.color || colors[i % colors.length],
      percentage: ((d.value / total) * 100).toFixed(1),
    };
  });

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative">
        <svg width={size} height={size}>
          {segments.map((segment, i) => (
            <path
              key={i}
              d={segment.path}
              fill={segment.color}
              className={`cursor-pointer hover:opacity-80 transition-opacity ${
                animate ? 'animate-fade-in' : ''
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </svg>
        {showLabels && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(total)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            </div>
          </div>
        )}
      </div>

      {showLegend && (
        <div className="flex flex-wrap justify-center gap-3">
          {segments.map((segment, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {segment.label} ({segment.percentage}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Chart Component
// ============================================================================

export function Chart({ data, type = 'line', ...props }: ChartProps) {
  switch (type) {
    case 'bar':
      return <BarChart data={data} {...props} />;
    case 'area':
      return <LineChart data={data} filled {...props} />;
    case 'line':
    default:
      return <LineChart data={data} {...props} />;
  }
}

export default Chart;
