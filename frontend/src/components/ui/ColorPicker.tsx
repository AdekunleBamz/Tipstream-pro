'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (color: string) => void;
  presetColors?: string[];
  showInput?: boolean;
  showPresets?: boolean;
  disabled?: boolean;
  className?: string;
}

interface ColorSwatchProps {
  color: string;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function isValidHex(hex: string): boolean {
  return /^#?([a-f\d]{3}|[a-f\d]{6})$/i.test(hex);
}

function normalizeHex(hex: string): string {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }
  return `#${hex.toLowerCase()}`;
}

// ============================================================================
// Color Swatch Component
// ============================================================================

export function ColorSwatch({
  color,
  selected = false,
  size = 'md',
  onClick,
  className = '',
}: ColorSwatchProps) {
  const sizeStyles = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        ${sizeStyles[size]} rounded-lg border-2 transition-all
        ${selected
          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800 scale-110'
          : 'border-gray-200 dark:border-gray-600 hover:scale-105'
        }
        ${className}
      `}
      style={{ backgroundColor: color }}
      title={color}
    />
  );
}

// ============================================================================
// Color Picker Component
// ============================================================================

const defaultPresets = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#78716c', '#64748b', '#000000',
];

export function ColorPicker({
  value: controlledValue,
  defaultValue = '#3b82f6',
  onChange,
  presetColors = defaultPresets,
  showInput = true,
  showPresets = true,
  disabled = false,
  className = '',
}: ColorPickerProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const value = controlledValue ?? internalValue;
  const hsl = hexToHsl(value);

  const handleColorChange = useCallback(
    (newColor: string) => {
      const normalized = normalizeHex(newColor);
      setInternalValue(normalized);
      setInputValue(normalized);
      onChange?.(normalized);
    },
    [onChange]
  );

  const handleHueChange = useCallback(
    (hue: number) => {
      const newColor = hslToHex(hue, hsl.s, hsl.l);
      handleColorChange(newColor);
    },
    [hsl.s, hsl.l, handleColorChange]
  );

  const handleSaturationLightnessChange = useCallback(
    (clientX: number, clientY: number, rect: DOMRect) => {
      const s = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const l = Math.max(0, Math.min(100, 100 - ((clientY - rect.top) / rect.height) * 100));
      const newColor = hslToHex(hsl.h, s, l);
      handleColorChange(newColor);
    },
    [hsl.h, handleColorChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (isValidHex(newValue)) {
      handleColorChange(newValue);
    }
  };

  const handleInputBlur = () => {
    if (!isValidHex(inputValue)) {
      setInputValue(value);
    }
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Color Preview Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border
          bg-white dark:bg-gray-800
          border-gray-300 dark:border-gray-600
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
        `}
      >
        <div
          className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
          style={{ backgroundColor: value }}
        />
        <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
          {value}
        </span>
      </button>

      {/* Picker Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          {/* Saturation/Lightness Panel */}
          <div
            className="relative w-48 h-48 rounded-lg cursor-crosshair mb-3"
            style={{
              background: `
                linear-gradient(to right, #fff 0%, hsl(${hsl.h}, 100%, 50%) 100%),
                linear-gradient(to top, #000 0%, transparent 100%)
              `,
              backgroundBlendMode: 'multiply',
            }}
            onMouseDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              handleSaturationLightnessChange(e.clientX, e.clientY, rect);

              const handleMove = (moveEvent: MouseEvent) => {
                handleSaturationLightnessChange(moveEvent.clientX, moveEvent.clientY, rect);
              };
              const handleUp = () => {
                document.removeEventListener('mousemove', handleMove);
                document.removeEventListener('mouseup', handleUp);
              };
              document.addEventListener('mousemove', handleMove);
              document.addEventListener('mouseup', handleUp);
            }}
          >
            <div
              className="absolute w-4 h-4 border-2 border-white rounded-full shadow -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${hsl.s}%`,
                top: `${100 - hsl.l}%`,
                backgroundColor: value,
              }}
            />
          </div>

          {/* Hue Slider */}
          <div
            className="relative w-48 h-3 rounded-full cursor-pointer mb-3"
            style={{
              background:
                'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
            }}
            onMouseDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const updateHue = (clientX: number) => {
                const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                handleHueChange(percent * 360);
              };
              updateHue(e.clientX);

              const handleMove = (moveEvent: MouseEvent) => updateHue(moveEvent.clientX);
              const handleUp = () => {
                document.removeEventListener('mousemove', handleMove);
                document.removeEventListener('mouseup', handleUp);
              };
              document.addEventListener('mousemove', handleMove);
              document.addEventListener('mouseup', handleUp);
            }}
          >
            <div
              className="absolute w-3 h-3 border-2 border-white rounded-full shadow -translate-x-1/2"
              style={{
                left: `${(hsl.h / 360) * 100}%`,
                backgroundColor: hslToHex(hsl.h, 100, 50),
              }}
            />
          </div>

          {/* Input */}
          {showInput && (
            <div className="mb-3">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="w-full px-3 py-1.5 text-sm font-mono rounded border
                  bg-gray-50 dark:bg-gray-900
                  border-gray-300 dark:border-gray-600
                  text-gray-700 dark:text-gray-300
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#000000"
              />
            </div>
          )}

          {/* Preset Colors */}
          {showPresets && (
            <div className="grid grid-cols-10 gap-1">
              {presetColors.map((color) => (
                <ColorSwatch
                  key={color}
                  color={color}
                  size="sm"
                  selected={value.toLowerCase() === color.toLowerCase()}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Gradient Picker Component
// ============================================================================

interface GradientStop {
  color: string;
  position: number;
}

interface GradientPickerProps {
  stops?: GradientStop[];
  angle?: number;
  type?: 'linear' | 'radial';
  onChange?: (gradient: { stops: GradientStop[]; angle: number; type: 'linear' | 'radial' }) => void;
  className?: string;
}

export function GradientPicker({
  stops: initialStops = [
    { color: '#3b82f6', position: 0 },
    { color: '#8b5cf6', position: 100 },
  ],
  angle: initialAngle = 90,
  type: initialType = 'linear',
  onChange,
  className = '',
}: GradientPickerProps) {
  const [stops, setStops] = useState(initialStops);
  const [angle, setAngle] = useState(initialAngle);
  const [type, setType] = useState(initialType);
  const [selectedStop, setSelectedStop] = useState(0);

  const gradientCSS =
    type === 'linear'
      ? `linear-gradient(${angle}deg, ${stops.map((s) => `${s.color} ${s.position}%`).join(', ')})`
      : `radial-gradient(circle, ${stops.map((s) => `${s.color} ${s.position}%`).join(', ')})`;

  const updateGradient = useCallback(
    (newStops: GradientStop[], newAngle: number, newType: 'linear' | 'radial') => {
      setStops(newStops);
      setAngle(newAngle);
      setType(newType);
      onChange?.({ stops: newStops, angle: newAngle, type: newType });
    },
    [onChange]
  );

  const updateStopColor = (index: number, color: string) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], color };
    updateGradient(newStops, angle, type);
  };

  return (
    <div className={className}>
      {/* Gradient Preview */}
      <div
        className="w-full h-16 rounded-lg mb-4 border border-gray-200 dark:border-gray-700"
        style={{ background: gradientCSS }}
      />

      {/* Type Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => updateGradient(stops, angle, 'linear')}
          className={`px-3 py-1 text-sm rounded ${
            type === 'linear'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Linear
        </button>
        <button
          onClick={() => updateGradient(stops, angle, 'radial')}
          className={`px-3 py-1 text-sm rounded ${
            type === 'radial'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Radial
        </button>
      </div>

      {/* Angle Slider (for linear) */}
      {type === 'linear' && (
        <div className="mb-4">
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            Angle: {angle}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => updateGradient(stops, parseInt(e.target.value), type)}
            className="w-full"
          />
        </div>
      )}

      {/* Stops */}
      <div className="space-y-2">
        {stops.map((stop, index) => (
          <div key={index} className="flex items-center gap-2">
            <ColorSwatch
              color={stop.color}
              size="md"
              selected={selectedStop === index}
              onClick={() => setSelectedStop(index)}
            />
            <input
              type="text"
              value={stop.color}
              onChange={(e) => {
                if (isValidHex(e.target.value)) {
                  updateStopColor(index, normalizeHex(e.target.value));
                }
              }}
              className="flex-1 px-2 py-1 text-sm font-mono rounded border
                bg-gray-50 dark:bg-gray-900
                border-gray-300 dark:border-gray-600
                text-gray-700 dark:text-gray-300"
            />
            <span className="text-sm text-gray-500">{stop.position}%</span>
          </div>
        ))}
      </div>

      {/* CSS Output */}
      <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
        background: {gradientCSS};
      </div>
    </div>
  );
}

// ============================================================================
// Color Palette Component
// ============================================================================

interface ColorPaletteProps {
  colors: string[];
  selected?: string;
  onSelect?: (color: string) => void;
  columns?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ColorPalette({
  colors,
  selected,
  onSelect,
  columns = 5,
  size = 'md',
  className = '',
}: ColorPaletteProps) {
  return (
    <div
      className={`grid gap-2 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {colors.map((color) => (
        <ColorSwatch
          key={color}
          color={color}
          size={size}
          selected={selected?.toLowerCase() === color.toLowerCase()}
          onClick={() => onSelect?.(color)}
        />
      ))}
    </div>
  );
}

export default ColorPicker;
