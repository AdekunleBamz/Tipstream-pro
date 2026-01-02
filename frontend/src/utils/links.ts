export const BASESCAN_URL = 'https://basescan.org';

export function getAddressUrl(address: string): string {
  return `${BASESCAN_URL}/address/${address}`;
}

export function getTxUrl(hash: string): string {
  return `${BASESCAN_URL}/tx/${hash}`;
}

export function getTokenUrl(address: string, tokenId: string): string {
  return `${BASESCAN_URL}/token/${address}?a=${tokenId}`;
}

export function getNftUrl(address: string, tokenId: string): string {
  return `${BASESCAN_URL}/nft/${address}/${tokenId}`;
}
