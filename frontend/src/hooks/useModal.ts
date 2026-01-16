'use client';

import { useState, useCallback } from 'react';

interface ModalState {
  isOpen: boolean;
  data?: unknown;
}

interface UseModalReturn<T = unknown> {
  isOpen: boolean;
  data: T | undefined;
  open: (data?: T) => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Hook for managing modal open/close state with optional data
 */
export function useModal<T = unknown>(initialOpen = false): UseModalReturn<T> {
  const [state, setState] = useState<ModalState>({
    isOpen: initialOpen,
    data: undefined,
  });

  const open = useCallback((data?: T) => {
    setState({ isOpen: true, data });
  }, []);

  const close = useCallback(() => {
    setState({ isOpen: false, data: undefined });
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => ({
      isOpen: !prev.isOpen,
      data: prev.isOpen ? undefined : prev.data,
    }));
  }, []);

  return {
    isOpen: state.isOpen,
    data: state.data as T | undefined,
    open,
    close,
    toggle,
  };
}

/**
 * Hook for managing multiple named modals
 */
type ModalName = string;

interface UseModalsReturn {
  isOpen: (name: ModalName) => boolean;
  getData: <T>(name: ModalName) => T | undefined;
  open: <T>(name: ModalName, data?: T) => void;
  close: (name: ModalName) => void;
  closeAll: () => void;
}

export function useModals(): UseModalsReturn {
  const [modals, setModals] = useState<Record<string, ModalState>>({});

  const isOpen = useCallback(
    (name: ModalName) => modals[name]?.isOpen ?? false,
    [modals]
  );

  const getData = useCallback(
    <T>(name: ModalName) => modals[name]?.data as T | undefined,
    [modals]
  );

  const open = useCallback(<T>(name: ModalName, data?: T) => {
    setModals((prev) => ({
      ...prev,
      [name]: { isOpen: true, data },
    }));
  }, []);

  const close = useCallback((name: ModalName) => {
    setModals((prev) => ({
      ...prev,
      [name]: { isOpen: false, data: undefined },
    }));
  }, []);

  const closeAll = useCallback(() => {
    setModals({});
  }, []);

  return {
    isOpen,
    getData,
    open,
    close,
    closeAll,
  };
}

/**
 * Hook for confirmation dialogs
 */
interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface UseConfirmReturn {
  isOpen: boolean;
  options: ConfirmOptions;
  confirm: (options?: ConfirmOptions) => Promise<boolean>;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export function useConfirm(): UseConfirmReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolve, setResolve] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions = {}): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);

    return new Promise((res) => {
      setResolve(() => res);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolve?.(true);
    setResolve(null);
  }, [resolve]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolve?.(false);
    setResolve(null);
  }, [resolve]);

  return {
    isOpen,
    options,
    confirm,
    handleConfirm,
    handleCancel,
  };
}

/**
 * Common modal names for type safety
 */
export const MODAL_NAMES = {
  TIP: 'tip',
  SUBSCRIBE: 'subscribe',
  CONNECT_WALLET: 'connectWallet',
  CONFIRM_TIP: 'confirmTip',
  TRANSACTION_STATUS: 'transactionStatus',
  SHARE: 'share',
  SETTINGS: 'settings',
  PROFILE: 'profile',
} as const;

export type ModalNameType = (typeof MODAL_NAMES)[keyof typeof MODAL_NAMES];
