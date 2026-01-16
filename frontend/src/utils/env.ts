/**
 * Environment Variables Validation
 * 
 * Validates required environment variables at build/runtime.
 */

type EnvVarConfig = {
  required: boolean;
  default?: string;
  validate?: (value: string) => boolean;
  description?: string;
};

const ENV_SCHEMA: Record<string, EnvVarConfig> = {
  // Required
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: {
    required: true,
    description: 'WalletConnect Cloud Project ID',
  },
  
  // Chain configuration
  NEXT_PUBLIC_CHAIN_ID: {
    required: false,
    default: '8453',
    validate: (v) => ['8453', '84532'].includes(v),
    description: 'Chain ID (8453 for Base, 84532 for Base Sepolia)',
  },
  
  // Contract addresses
  NEXT_PUBLIC_TIPSTREAM_ADDRESS: {
    required: false,
    description: 'TipStream contract address',
  },
  NEXT_PUBLIC_SUBSCRIPTION_MANAGER_ADDRESS: {
    required: false,
    description: 'SubscriptionManager contract address',
  },
  NEXT_PUBLIC_TIPNFT_ADDRESS: {
    required: false,
    description: 'TipNFT contract address',
  },
  NEXT_PUBLIC_DAILY_CHECKIN_ADDRESS: {
    required: false,
    description: 'DailyCheckIn contract address',
  },
  
  // API configuration
  NEXT_PUBLIC_API_URL: {
    required: false,
    default: '',
    description: 'Base API URL',
  },
  NEXT_PUBLIC_BASE_URL: {
    required: false,
    default: 'http://localhost:3000',
    description: 'Application base URL',
  },
  
  // Feature flags
  NEXT_PUBLIC_ENABLE_TESTNETS: {
    required: false,
    default: 'false',
    validate: (v) => ['true', 'false'].includes(v),
    description: 'Enable testnet support',
  },
};

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  values: Record<string, string | undefined>;
}

/**
 * Validate all environment variables
 */
export function validateEnv(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const values: Record<string, string | undefined> = {};

  for (const [key, config] of Object.entries(ENV_SCHEMA)) {
    const value = process.env[key] ?? config.default;
    values[key] = value;

    // Check required
    if (config.required && !value) {
      errors.push(`Missing required environment variable: ${key}${config.description ? ` (${config.description})` : ''}`);
      continue;
    }

    // Validate value
    if (value && config.validate && !config.validate(value)) {
      errors.push(`Invalid value for ${key}: "${value}"`);
    }

    // Warn about missing optional values
    if (!config.required && !value && !config.default) {
      warnings.push(`Optional environment variable not set: ${key}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    values,
  };
}

/**
 * Get environment variable with type safety
 */
export function getEnv<T extends keyof typeof ENV_SCHEMA>(
  key: T
): string | undefined {
  return process.env[key] ?? ENV_SCHEMA[key].default;
}

/**
 * Get required environment variable (throws if missing)
 */
export function requireEnv<T extends keyof typeof ENV_SCHEMA>(key: T): string {
  const value = getEnv(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running on client
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if running on server
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Get current chain ID
 */
export function getChainId(): number {
  const chainId = getEnv('NEXT_PUBLIC_CHAIN_ID');
  return chainId ? parseInt(chainId, 10) : 8453;
}

/**
 * Check if testnet is enabled
 */
export function isTestnetEnabled(): boolean {
  return getEnv('NEXT_PUBLIC_ENABLE_TESTNETS') === 'true';
}

/**
 * Print environment status (for debugging)
 */
export function printEnvStatus(): void {
  if (!isDevelopment()) return;

  const result = validateEnv();
  
  console.group('🔧 Environment Configuration');
  
  if (result.errors.length > 0) {
    console.error('❌ Errors:');
    result.errors.forEach((e) => console.error(`  - ${e}`));
  }
  
  if (result.warnings.length > 0) {
    console.warn('⚠️ Warnings:');
    result.warnings.forEach((w) => console.warn(`  - ${w}`));
  }
  
  if (result.valid) {
    console.log('✅ All required environment variables are set');
  }
  
  console.groupEnd();
}
