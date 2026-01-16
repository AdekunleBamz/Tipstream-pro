// ============================================================================
// Crypto Utilities - Cryptographic helper functions
// ============================================================================

import { keccak256, toHex, toBytes, recoverMessageAddress, hashMessage } from 'viem';

// ============================================================================
// Hash Functions
// ============================================================================

/**
 * Hash a string using Keccak-256
 */
export function hashString(input: string): `0x${string}` {
  return keccak256(toHex(input));
}

/**
 * Hash arbitrary data using Keccak-256
 */
export function hashData(data: Uint8Array): `0x${string}` {
  return keccak256(data);
}

/**
 * Create a deterministic ID from multiple inputs
 */
export function createDeterministicId(...inputs: (string | number | bigint)[]): `0x${string}` {
  const combined = inputs.map(String).join('|');
  return hashString(combined);
}

/**
 * Hash a message for Ethereum signing (EIP-191)
 */
export function hashEthereumMessage(message: string): `0x${string}` {
  return hashMessage(message);
}

// ============================================================================
// Address Utilities
// ============================================================================

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): address is `0x${string}` {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return false;
  }
  return true;
}

/**
 * Convert address to checksummed format
 */
export function toChecksumAddress(address: string): `0x${string}` | null {
  if (!isValidAddress(address)) {
    return null;
  }

  const lowercaseAddress = address.toLowerCase().slice(2);
  const hash = keccak256(toHex(lowercaseAddress)).slice(2);
  
  let checksumAddress = '0x';
  for (let i = 0; i < 40; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      checksumAddress += lowercaseAddress[i].toUpperCase();
    } else {
      checksumAddress += lowercaseAddress[i];
    }
  }

  return checksumAddress as `0x${string}`;
}

/**
 * Check if address has valid checksum
 */
export function hasValidChecksum(address: string): boolean {
  if (!isValidAddress(address)) {
    return false;
  }

  const checksummed = toChecksumAddress(address);
  return checksummed === address;
}

/**
 * Shorten address for display
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!isValidAddress(address)) {
    return address;
  }
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Compare addresses (case-insensitive)
 */
export function addressesEqual(a: string, b: string): boolean {
  if (!isValidAddress(a) || !isValidAddress(b)) {
    return false;
  }
  return a.toLowerCase() === b.toLowerCase();
}

// ============================================================================
// Signature Utilities
// ============================================================================

/**
 * Signature components
 */
export interface SignatureComponents {
  r: `0x${string}`;
  s: `0x${string}`;
  v: number;
}

/**
 * Split signature into components
 */
export function splitSignature(signature: `0x${string}`): SignatureComponents {
  const bytes = toBytes(signature);
  
  if (bytes.length !== 65) {
    throw new Error('Invalid signature length');
  }

  const r = toHex(bytes.slice(0, 32)) as `0x${string}`;
  const s = toHex(bytes.slice(32, 64)) as `0x${string}`;
  let v = bytes[64];

  // Handle legacy v values
  if (v < 27) {
    v += 27;
  }

  return { r, s, v };
}

/**
 * Join signature components
 */
export function joinSignature(components: SignatureComponents): `0x${string}` {
  const rBytes = toBytes(components.r);
  const sBytes = toBytes(components.s);
  const vByte = new Uint8Array([components.v < 27 ? components.v + 27 : components.v]);
  
  const combined = new Uint8Array(65);
  combined.set(rBytes, 0);
  combined.set(sBytes, 32);
  combined.set(vByte, 64);

  return toHex(combined) as `0x${string}`;
}

/**
 * Recover signer address from signature
 */
export async function recoverSigner(
  message: string,
  signature: `0x${string}`
): Promise<`0x${string}`> {
  return recoverMessageAddress({
    message,
    signature,
  });
}

/**
 * Verify a message was signed by expected address
 */
export async function verifySignature(
  message: string,
  signature: `0x${string}`,
  expectedSigner: `0x${string}`
): Promise<boolean> {
  try {
    const recoveredAddress = await recoverSigner(message, signature);
    return addressesEqual(recoveredAddress, expectedSigner);
  } catch {
    return false;
  }
}

// ============================================================================
// Random Generation
// ============================================================================

/**
 * Generate random bytes
 */
export function randomBytes(length: number): Uint8Array {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
  }
  throw new Error('No secure random number generator available');
}

/**
 * Generate random hex string
 */
export function randomHex(byteLength: number): `0x${string}` {
  return toHex(randomBytes(byteLength)) as `0x${string}`;
}

/**
 * Generate random ID (32 bytes / 64 hex chars)
 */
export function randomId(): `0x${string}` {
  return randomHex(32);
}

/**
 * Generate random nonce
 */
export function randomNonce(): bigint {
  const bytes = randomBytes(8);
  let nonce = 0n;
  for (let i = 0; i < 8; i++) {
    nonce = (nonce << 8n) | BigInt(bytes[i]);
  }
  return nonce;
}

// ============================================================================
// Encoding Utilities
// ============================================================================

/**
 * Encode string to hex
 */
export function stringToHex(str: string): `0x${string}` {
  return toHex(str) as `0x${string}`;
}

/**
 * Decode hex to string
 */
export function hexToString(hex: `0x${string}`): string {
  const bytes = toBytes(hex);
  return new TextDecoder().decode(bytes);
}

/**
 * Encode bytes to base64
 */
export function bytesToBase64(bytes: Uint8Array): string {
  if (typeof btoa !== 'undefined') {
    return btoa(String.fromCharCode(...bytes));
  }
  return Buffer.from(bytes).toString('base64');
}

/**
 * Decode base64 to bytes
 */
export function base64ToBytes(base64: string): Uint8Array {
  if (typeof atob !== 'undefined') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return new Uint8Array(Buffer.from(base64, 'base64'));
}

// ============================================================================
// EIP-712 Typed Data Helpers
// ============================================================================

/**
 * EIP-712 domain definition
 */
export interface TypedDataDomain {
  name?: string;
  version?: string;
  chainId?: number;
  verifyingContract?: `0x${string}`;
  salt?: `0x${string}`;
}

/**
 * Create TipStream domain for typed data signing
 */
export function createTipStreamDomain(
  chainId: number,
  verifyingContract: `0x${string}`
): TypedDataDomain {
  return {
    name: 'TipStream',
    version: '1',
    chainId,
    verifyingContract,
  };
}

/**
 * Tip message type definition for EIP-712
 */
export const TIP_MESSAGE_TYPES = {
  Tip: [
    { name: 'recipient', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'message', type: 'string' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
} as const;

/**
 * Subscription message type definition for EIP-712
 */
export const SUBSCRIPTION_MESSAGE_TYPES = {
  Subscribe: [
    { name: 'creator', type: 'address' },
    { name: 'tierId', type: 'uint256' },
    { name: 'duration', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
} as const;

// ============================================================================
// Merkle Tree Helpers
// ============================================================================

/**
 * Create leaf node for merkle tree
 */
export function createMerkleLeaf(...values: (string | `0x${string}`)[]): `0x${string}` {
  const combined = values.map((v) => (v.startsWith('0x') ? v : toHex(v))).join('');
  return keccak256(combined as `0x${string}`);
}

/**
 * Hash two nodes together (sorted for consistency)
 */
export function hashMerkleNodes(a: `0x${string}`, b: `0x${string}`): `0x${string}` {
  const sorted = a.toLowerCase() < b.toLowerCase() ? [a, b] : [b, a];
  return keccak256(`0x${sorted[0].slice(2)}${sorted[1].slice(2)}` as `0x${string}`);
}

/**
 * Build merkle tree from leaves
 */
export function buildMerkleTree(leaves: `0x${string}`[]): `0x${string}`[][] {
  if (leaves.length === 0) {
    return [];
  }

  const tree: `0x${string}`[][] = [leaves];
  let currentLevel = leaves;

  while (currentLevel.length > 1) {
    const nextLevel: `0x${string}`[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        nextLevel.push(hashMerkleNodes(currentLevel[i], currentLevel[i + 1]));
      } else {
        nextLevel.push(currentLevel[i]); // Odd leaf promoted
      }
    }
    tree.push(nextLevel);
    currentLevel = nextLevel;
  }

  return tree;
}

/**
 * Get merkle root from tree
 */
export function getMerkleRoot(tree: `0x${string}`[][]): `0x${string}` | null {
  if (tree.length === 0) {
    return null;
  }
  return tree[tree.length - 1][0];
}

/**
 * Get merkle proof for a leaf
 */
export function getMerkleProof(
  tree: `0x${string}`[][],
  leafIndex: number
): `0x${string}`[] {
  const proof: `0x${string}`[] = [];
  let index = leafIndex;

  for (let i = 0; i < tree.length - 1; i++) {
    const level = tree[i];
    const isRightNode = index % 2 === 1;
    const siblingIndex = isRightNode ? index - 1 : index + 1;

    if (siblingIndex < level.length) {
      proof.push(level[siblingIndex]);
    }

    index = Math.floor(index / 2);
  }

  return proof;
}

/**
 * Verify merkle proof
 */
export function verifyMerkleProof(
  leaf: `0x${string}`,
  proof: `0x${string}`[],
  root: `0x${string}`
): boolean {
  let computed = leaf;

  for (const proofElement of proof) {
    computed = hashMerkleNodes(computed, proofElement);
  }

  return computed.toLowerCase() === root.toLowerCase();
}
