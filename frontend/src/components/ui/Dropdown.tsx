'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Dropdown item type
 */
interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

/**
 * Dropdown divider
 */
interface DropdownDivider {
  type: 'divider';
}

/**
 * Dropdown section header
 */
interface DropdownHeader {
  type: 'header';
  label: string;
}

type DropdownChild = DropdownItem | DropdownDivider | DropdownHeader;

/**
 * Dropdown placement
 */
type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

/**
 * Dropdown props
 */
interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownChild[];
  placement?: DropdownPlacement;
  className?: string;
  menuClassName?: string;
  disabled?: boolean;
}

/**
 * Check if item is a divider
 */
function isDivider(item: DropdownChild): item is DropdownDivider {
  return 'type' in item && item.type === 'divider';
}

/**
 * Check if item is a header
 */
function isHeader(item: DropdownChild): item is DropdownHeader {
  return 'type' in item && item.type === 'header';
}

/**
 * Get placement styles
 */
function getPlacementStyles(placement: DropdownPlacement): string {
  const placements: Record<DropdownPlacement, string> = {
    'bottom-start': 'top-full left-0 mt-2',
    'bottom-end': 'top-full right-0 mt-2',
    'top-start': 'bottom-full left-0 mb-2',
    'top-end': 'bottom-full right-0 mb-2',
  };
  
  return placements[placement];
}

/**
 * Dropdown Menu component
 */
export function Dropdown({
  trigger,
  items,
  placement = 'bottom-start',
  className = '',
  menuClassName = '',
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close dropdown
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);
  
  // Handle escape key
  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);
  
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClickOutside, handleEscape]);
  
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      setIsOpen(false);
    }
  };
  
  const placementStyles = getPlacementStyles(placement);
  
  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div
        onClick={toggleDropdown}
        className={disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && toggleDropdown()}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>
      
      {/* Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 min-w-[200px] py-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg ${placementStyles} ${menuClassName}`}
          role="menu"
        >
          {items.map((item, index) => {
            // Render divider
            if (isDivider(item)) {
              return (
                <div
                  key={`divider-${index}`}
                  className="h-px bg-zinc-700 my-2"
                  role="separator"
                />
              );
            }
            
            // Render header
            if (isHeader(item)) {
              return (
                <div
                  key={`header-${index}`}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                >
                  {item.label}
                </div>
              );
            }
            
            // Render menu item
            const menuItem = item as DropdownItem;
            return (
              <button
                key={menuItem.id}
                onClick={() => handleItemClick(menuItem)}
                disabled={menuItem.disabled}
                className={`
                  w-full px-4 py-2 text-left flex items-center gap-3
                  transition-colors duration-150
                  ${menuItem.disabled
                    ? 'text-zinc-500 cursor-not-allowed'
                    : menuItem.danger
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-zinc-200 hover:bg-zinc-800'
                  }
                `}
                role="menuitem"
              >
                {menuItem.icon && (
                  <span className="text-current">{menuItem.icon}</span>
                )}
                <span>{menuItem.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Context Menu component (right-click menu)
 */
interface ContextMenuProps {
  children: React.ReactNode;
  items: DropdownChild[];
  menuClassName?: string;
}

export function ContextMenu({ children, items, menuClassName = '' }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setIsOpen(true);
  };
  
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);
  
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);
  
  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      setIsOpen(false);
    }
  };
  
  return (
    <>
      <div onContextMenu={handleContextMenu}>
        {children}
      </div>
      
      {isOpen && (
        <div
          ref={menuRef}
          className={`fixed z-50 min-w-[200px] py-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg ${menuClassName}`}
          style={{ left: position.x, top: position.y }}
          role="menu"
        >
          {items.map((item, index) => {
            if (isDivider(item)) {
              return (
                <div
                  key={`divider-${index}`}
                  className="h-px bg-zinc-700 my-2"
                  role="separator"
                />
              );
            }
            
            if (isHeader(item)) {
              return (
                <div
                  key={`header-${index}`}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                >
                  {item.label}
                </div>
              );
            }
            
            const menuItem = item as DropdownItem;
            return (
              <button
                key={menuItem.id}
                onClick={() => handleItemClick(menuItem)}
                disabled={menuItem.disabled}
                className={`
                  w-full px-4 py-2 text-left flex items-center gap-3
                  transition-colors duration-150
                  ${menuItem.disabled
                    ? 'text-zinc-500 cursor-not-allowed'
                    : menuItem.danger
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-zinc-200 hover:bg-zinc-800'
                  }
                `}
                role="menuitem"
              >
                {menuItem.icon && (
                  <span className="text-current">{menuItem.icon}</span>
                )}
                <span>{menuItem.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Dropdown;
