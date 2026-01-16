/**
 * Hooks Barrel Export
 * 
 * All custom hooks for TipStream Pro
 */

// Contract interaction hooks
export { useTipStream } from './useTipStream';
export { useDailyCheckIn } from './useDailyCheckIn';
export { useSubscription } from './useSubscription';
export { useTipNFT } from './useTipNFT';

// Utility hooks
export { useLocalStorage } from './useLocalStorage';
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useCopyToClipboard } from './useCopyToClipboard';
export { useMediaQuery, useBreakpoint } from './useMediaQuery';
export { useOnClickOutside } from './useOnClickOutside';

// Transaction and contract hooks
export { 
  useTransactionStatus, 
  getStatusMessage, 
  getExplorerUrl 
} from './useTransactionStatus';
export { 
  useContractEvents, 
  useTipEvents,
  filterEventsByAddress,
  calculateTotalFromEvents,
} from './useContractEvents';

// UI state hooks
export { 
  useModal, 
  useModals, 
  useConfirm, 
  MODAL_NAMES 
} from './useModal';

// Network hooks
export {
  useNetworkStatus,
  getNetworkInfo,
  isSupportedChain,
  getAddressExplorerUrl,
  getTxExplorerUrl,
  getBlockExplorerUrl,
  SUPPORTED_NETWORKS,
  DEFAULT_NETWORK,
} from './useNetworkStatus';
