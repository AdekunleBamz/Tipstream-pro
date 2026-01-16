'use client';

import { useState, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  latency?: number;
  uptime: number;
  lastChecked: Date;
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  createdAt: Date;
  updatedAt: Date;
  updates: {
    status: string;
    message: string;
    timestamp: Date;
  }[];
}

// ============================================================================
// Mock Data
// ============================================================================

const services: ServiceStatus[] = [
  {
    name: 'TipStream API',
    status: 'operational',
    latency: 45,
    uptime: 99.99,
    lastChecked: new Date(),
  },
  {
    name: 'Smart Contracts',
    status: 'operational',
    uptime: 100,
    lastChecked: new Date(),
  },
  {
    name: 'NFT Minting Service',
    status: 'operational',
    latency: 120,
    uptime: 99.95,
    lastChecked: new Date(),
  },
  {
    name: 'Subscription Management',
    status: 'operational',
    latency: 38,
    uptime: 99.98,
    lastChecked: new Date(),
  },
  {
    name: 'Daily Check-In',
    status: 'operational',
    latency: 25,
    uptime: 99.99,
    lastChecked: new Date(),
  },
  {
    name: 'Frontend Application',
    status: 'operational',
    latency: 15,
    uptime: 99.99,
    lastChecked: new Date(),
  },
];

const incidents: Incident[] = [
  {
    id: 'inc-001',
    title: 'Scheduled Maintenance - Contract Upgrades',
    status: 'resolved',
    severity: 'minor',
    createdAt: new Date('2024-01-15T02:00:00'),
    updatedAt: new Date('2024-01-15T04:30:00'),
    updates: [
      {
        status: 'Resolved',
        message: 'Maintenance completed successfully. All systems operational.',
        timestamp: new Date('2024-01-15T04:30:00'),
      },
      {
        status: 'In Progress',
        message: 'Deploying contract upgrades to mainnet.',
        timestamp: new Date('2024-01-15T03:00:00'),
      },
      {
        status: 'Scheduled',
        message: 'Beginning scheduled maintenance window for contract upgrades.',
        timestamp: new Date('2024-01-15T02:00:00'),
      },
    ],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

function getStatusColor(status: ServiceStatus['status']): string {
  switch (status) {
    case 'operational':
      return 'bg-green-500';
    case 'degraded':
      return 'bg-yellow-500';
    case 'outage':
      return 'bg-red-500';
    case 'maintenance':
      return 'bg-blue-500';
  }
}

function getStatusText(status: ServiceStatus['status']): string {
  switch (status) {
    case 'operational':
      return 'Operational';
    case 'degraded':
      return 'Degraded Performance';
    case 'outage':
      return 'Major Outage';
    case 'maintenance':
      return 'Under Maintenance';
  }
}

function getSeverityColor(severity: Incident['severity']): string {
  switch (severity) {
    case 'minor':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'major':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'critical':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ============================================================================
// Uptime Bar Component
// ============================================================================

function UptimeBar({ days = 90 }: { days?: number }) {
  // Generate mock uptime data for visualization
  const uptimeData = Array.from({ length: days }, (_, i) => {
    const rand = Math.random();
    if (rand > 0.98) return 'degraded';
    if (rand > 0.995) return 'outage';
    return 'operational';
  });

  return (
    <div className="flex gap-0.5">
      {uptimeData.map((status, index) => (
        <div
          key={index}
          className={`w-1 h-8 rounded-sm ${
            status === 'operational'
              ? 'bg-green-500'
              : status === 'degraded'
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
          title={`Day ${days - index}: ${status}`}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Status Page Component
// ============================================================================

export default function StatusPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const allOperational = services.every((s) => s.status === 'operational');
  const overallStatus = allOperational
    ? 'All Systems Operational'
    : 'Some Systems Experiencing Issues';

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            TipStream Status
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time status of all TipStream services
          </p>
        </div>

        {/* Overall Status Banner */}
        <div
          className={`p-6 rounded-xl mb-8 ${
            allOperational
              ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
              : 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-4 h-4 rounded-full ${
                allOperational ? 'bg-green-500' : 'bg-yellow-500'
              } animate-pulse`}
            />
            <div>
              <h2
                className={`text-xl font-bold ${
                  allOperational
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-yellow-800 dark:text-yellow-200'
                }`}
              >
                {overallStatus}
              </h2>
              <p
                className={`text-sm ${
                  allOperational
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}
              >
                Last checked: {formatDate(currentTime)}
              </p>
            </div>
          </div>
        </div>

        {/* 90-Day Uptime */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              90-Day Uptime
            </h3>
            <span className="text-2xl font-bold text-green-500">99.98%</span>
          </div>
          <UptimeBar days={90} />
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Services List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Services
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {services.map((service) => (
              <div
                key={service.name}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {service.name}
                    </p>
                    {service.latency && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {service.latency}ms latency
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-sm font-medium ${
                      service.status === 'operational'
                        ? 'text-green-600 dark:text-green-400'
                        : service.status === 'degraded'
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {getStatusText(service.status)}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {service.uptime}% uptime
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Incidents
            </h3>
          </div>
          {incidents.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No incidents reported in the last 30 days
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {incidents.map((incident) => (
                <div key={incident.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {incident.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(incident.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
                          incident.severity
                        )}`}
                      >
                        {incident.severity}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          incident.status === 'resolved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {incident.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                    {incident.updates.map((update, index) => (
                      <div key={index}>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {update.status}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {update.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDate(update.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subscribe to Updates */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Subscribe to Updates</h3>
          <p className="opacity-90 mb-4">
            Get notified when there are changes to system status
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            For urgent issues, contact us at{' '}
            <a
              href="mailto:status@tipstream.pro"
              className="text-blue-500 hover:underline"
            >
              status@tipstream.pro
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
