/**
 * Health Check API Route
 * 
 * API endpoint for health checks and monitoring.
 */

import { NextResponse } from 'next/server';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    name: string;
    status: 'pass' | 'fail';
    message?: string;
    duration?: number;
  }[];
}

const startTime = Date.now();

/**
 * GET /api/health
 * Health check endpoint
 */
export async function GET() {
  const checks: HealthCheck['checks'] = [];

  // Check 1: Basic app health
  checks.push({
    name: 'app',
    status: 'pass',
    message: 'Application is running',
  });

  // Check 2: Environment variables
  const envCheck = checkEnvironment();
  checks.push(envCheck);

  // Check 3: Memory usage
  const memoryCheck = checkMemory();
  checks.push(memoryCheck);

  // Determine overall status
  const hasFailure = checks.some(c => c.status === 'fail');
  const status: HealthCheck['status'] = hasFailure ? 'degraded' : 'healthy';

  const health: HealthCheck = {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks,
  };

  return NextResponse.json(health, {
    status: status === 'healthy' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

/**
 * Check environment variables
 */
function checkEnvironment(): HealthCheck['checks'][0] {
  const requiredVars = [
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
  ];

  const missing = requiredVars.filter(v => !process.env[v]);

  if (missing.length > 0) {
    return {
      name: 'environment',
      status: 'fail',
      message: `Missing environment variables: ${missing.join(', ')}`,
    };
  }

  return {
    name: 'environment',
    status: 'pass',
    message: 'All required environment variables are set',
  };
}

/**
 * Check memory usage
 */
function checkMemory(): HealthCheck['checks'][0] {
  // Note: process.memoryUsage() is available in Node.js
  // In Edge runtime, this would need to be handled differently
  try {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
      const heapUsagePercent = Math.round((usage.heapUsed / usage.heapTotal) * 100);

      if (heapUsagePercent > 90) {
        return {
          name: 'memory',
          status: 'fail',
          message: `High memory usage: ${heapUsedMB}MB / ${heapTotalMB}MB (${heapUsagePercent}%)`,
        };
      }

      return {
        name: 'memory',
        status: 'pass',
        message: `${heapUsedMB}MB / ${heapTotalMB}MB (${heapUsagePercent}%)`,
      };
    }
  } catch {
    // Memory check not available
  }

  return {
    name: 'memory',
    status: 'pass',
    message: 'Memory check not available in this runtime',
  };
}

/**
 * HEAD /api/health
 * Lightweight health check (for load balancers)
 */
export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
