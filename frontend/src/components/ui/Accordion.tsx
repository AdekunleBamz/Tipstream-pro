'use client';

import React, { useState, createContext, useContext, useCallback } from 'react';

/**
 * Accordion Context
 */
interface AccordionContextValue {
  openItems: Set<string>;
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

/**
 * Accordion Item Context
 */
interface AccordionItemContextValue {
  id: string;
  isOpen: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

/**
 * Accordion props
 */
interface AccordionProps {
  children: React.ReactNode;
  defaultOpenItems?: string[];
  allowMultiple?: boolean;
  className?: string;
}

/**
 * Accordion component
 */
export function Accordion({
  children,
  defaultOpenItems = [],
  allowMultiple = false,
  className = '',
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(defaultOpenItems)
  );
  
  const toggleItem = useCallback((id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      
      return newSet;
    });
  }, [allowMultiple]);
  
  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple }}>
      <div className={`divide-y divide-zinc-800 ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

/**
 * Accordion Item props
 */
interface AccordionItemProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

/**
 * Accordion Item component
 */
export function AccordionItem({ children, id, className = '' }: AccordionItemProps) {
  const context = useContext(AccordionContext);
  
  if (!context) {
    throw new Error('AccordionItem must be used within an Accordion');
  }
  
  const isOpen = context.openItems.has(id);
  
  return (
    <AccordionItemContext.Provider value={{ id, isOpen }}>
      <div className={`${className}`}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

/**
 * Accordion Trigger props
 */
interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Accordion Trigger component
 */
export function AccordionTrigger({ children, className = '' }: AccordionTriggerProps) {
  const accordionContext = useContext(AccordionContext);
  const itemContext = useContext(AccordionItemContext);
  
  if (!accordionContext || !itemContext) {
    throw new Error('AccordionTrigger must be used within an AccordionItem');
  }
  
  const { toggleItem } = accordionContext;
  const { id, isOpen } = itemContext;
  
  return (
    <button
      onClick={() => toggleItem(id)}
      className={`
        w-full py-4 flex items-center justify-between
        text-left text-white font-medium
        transition-colors duration-200
        hover:text-purple-400
        focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-2 focus:ring-offset-zinc-900
        ${className}
      `}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${id}`}
    >
      <span>{children}</span>
      <svg
        className={`w-5 h-5 transition-transform duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
}

/**
 * Accordion Content props
 */
interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Accordion Content component
 */
export function AccordionContent({ children, className = '' }: AccordionContentProps) {
  const itemContext = useContext(AccordionItemContext);
  
  if (!itemContext) {
    throw new Error('AccordionContent must be used within an AccordionItem');
  }
  
  const { id, isOpen } = itemContext;
  
  return (
    <div
      id={`accordion-content-${id}`}
      className={`
        overflow-hidden transition-all duration-300
        ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
      `}
      role="region"
      aria-labelledby={`accordion-trigger-${id}`}
    >
      <div className={`pb-4 text-zinc-400 ${className}`}>
        {children}
      </div>
    </div>
  );
}

/**
 * FAQ Accordion - pre-styled for FAQ pages
 */
interface FAQItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
}

interface FAQAccordionProps {
  items: FAQItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function FAQAccordion({ items, allowMultiple = false, className = '' }: FAQAccordionProps) {
  return (
    <Accordion allowMultiple={allowMultiple} className={className}>
      {items.map((item) => (
        <AccordionItem key={item.id} id={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>
            {typeof item.answer === 'string' ? (
              <p>{item.answer}</p>
            ) : (
              item.answer
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default Accordion;
