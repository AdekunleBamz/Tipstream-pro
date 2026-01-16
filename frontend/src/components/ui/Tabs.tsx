'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Tab Context
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

// Tabs Container
interface TabsProps {
  children: ReactNode;
  defaultValue: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Tabs({
  children,
  defaultValue,
  value,
  onChange,
  className = '',
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value ?? internalValue;

  const setActiveTab = (id: string) => {
    if (!value) {
      setInternalValue(id);
    }
    onChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// Tab List
interface TabListProps {
  children: ReactNode;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

const listVariantStyles = {
  default: 'bg-gray-800/50 p-1 rounded-lg gap-1',
  pills: 'gap-2',
  underline: 'border-b border-gray-700 gap-4',
};

export function TabList({
  children,
  variant = 'default',
  className = '',
}: TabListProps) {
  return (
    <div
      className={`flex ${listVariantStyles[variant]} ${className}`}
      role="tablist"
    >
      {children}
    </div>
  );
}

// Tab Trigger
interface TabTriggerProps {
  value: string;
  children: ReactNode;
  variant?: 'default' | 'pills' | 'underline';
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
}

const triggerBaseStyles = 'px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50';

const triggerVariantStyles = {
  default: {
    active: 'bg-gray-700 text-white rounded-md',
    inactive: 'text-gray-400 hover:text-gray-200',
  },
  pills: {
    active: 'bg-purple-600 text-white rounded-full',
    inactive: 'text-gray-400 hover:bg-gray-800 rounded-full',
  },
  underline: {
    active: 'text-purple-400 border-b-2 border-purple-500 -mb-px',
    inactive: 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent',
  },
};

export function TabTrigger({
  value,
  children,
  variant = 'default',
  disabled = false,
  icon,
  className = '',
}: TabTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;
  const styles = triggerVariantStyles[variant];

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={`
        ${triggerBaseStyles}
        ${isActive ? styles.active : styles.inactive}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

// Tab Content
interface TabContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabContent({
  value,
  children,
  className = '',
}: TabContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      className={`mt-4 animate-in fade-in duration-200 ${className}`}
    >
      {children}
    </div>
  );
}

// Simple Tabs - all-in-one component
interface SimpleTab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface SimpleTabsProps {
  tabs: SimpleTab[];
  defaultTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export function SimpleTabs({
  tabs,
  defaultTab,
  variant = 'default',
  className = '',
}: SimpleTabsProps) {
  const defaultValue = defaultTab || tabs[0]?.id || '';

  return (
    <Tabs defaultValue={defaultValue} className={className}>
      <TabList variant={variant}>
        {tabs.map((tab) => (
          <TabTrigger
            key={tab.id}
            value={tab.id}
            variant={variant}
            disabled={tab.disabled}
            icon={tab.icon}
          >
            {tab.label}
          </TabTrigger>
        ))}
      </TabList>

      {tabs.map((tab) => (
        <TabContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabContent>
      ))}
    </Tabs>
  );
}
