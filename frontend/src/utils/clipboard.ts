// Clipboard utilities

/**
 * Copy text to clipboard
 * @returns Promise that resolves to true if successful
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Try modern clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Clipboard API failed:', error);
    }
  }

  // Fallback to execCommand
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    console.error('execCommand fallback failed:', error);
    return false;
  }
}

/**
 * Copy address with shortened format displayed
 */
export async function copyAddress(address: string): Promise<{ success: boolean; displayText: string }> {
  const success = await copyToClipboard(address);
  const displayText = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return { success, displayText };
}

/**
 * Copy transaction hash
 */
export async function copyTxHash(hash: string): Promise<boolean> {
  return copyToClipboard(hash);
}

/**
 * Copy share link
 */
export async function copyShareLink(path: string = ''): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const url = `${window.location.origin}${path}`;
  return copyToClipboard(url);
}

/**
 * Read from clipboard (requires permission)
 */
export async function readFromClipboard(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      return await navigator.clipboard.readText();
    } catch (error) {
      console.error('Failed to read from clipboard:', error);
      return null;
    }
  }

  return null;
}

/**
 * Check if clipboard API is available
 */
export function isClipboardAvailable(): boolean {
  return typeof window !== 'undefined' && 
         !!navigator.clipboard && 
         window.isSecureContext;
}
