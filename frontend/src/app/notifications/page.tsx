'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

/**
 * Notifications Page
 * 
 * Displays user notifications with filtering, marking as read,
 * and notification preferences management.
 */

type NotificationType = 'tip' | 'subscription' | 'nft' | 'checkin' | 'system';
type NotificationFilter = 'all' | NotificationType;

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const { isConnected } = useAccount();
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'tip',
      title: 'New Tip Received!',
      message: 'alice.eth sent you 0.05 ETH',
      timestamp: '2 minutes ago',
      read: false,
      actionUrl: '/dashboard',
    },
    {
      id: '2',
      type: 'subscription',
      title: 'New Subscriber',
      message: 'bob.eth subscribed to your Pro tier',
      timestamp: '1 hour ago',
      read: false,
      actionUrl: '/creator',
    },
    {
      id: '3',
      type: 'nft',
      title: 'NFT Minted',
      message: 'Your supporter NFT #42 was minted successfully',
      timestamp: '3 hours ago',
      read: true,
      actionUrl: '/gallery',
    },
    {
      id: '4',
      type: 'checkin',
      title: 'Streak Milestone!',
      message: 'You reached a 7-day check-in streak! 🔥',
      timestamp: '1 day ago',
      read: true,
      actionUrl: '/checkin',
    },
    {
      id: '5',
      type: 'system',
      title: 'Platform Update',
      message: 'New features available! Check out the analytics dashboard.',
      timestamp: '2 days ago',
      read: true,
      actionUrl: '/analytics',
    },
    {
      id: '6',
      type: 'tip',
      title: 'Tip Confirmed',
      message: 'Your tip of 0.1 ETH to carol.eth was confirmed on-chain',
      timestamp: '3 days ago',
      read: true,
    },
  ]);
  
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'tip':
        return '💸';
      case 'subscription':
        return '⭐';
      case 'nft':
        return '🖼️';
      case 'checkin':
        return '🔥';
      case 'system':
        return '🔔';
      default:
        return '📝';
    }
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const filteredNotifications = notifications.filter(n => {
    if (filter !== 'all' && n.type !== filter) return false;
    if (showUnreadOnly && n.read) return false;
    return true;
  });
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                🔔 Notifications
                {unreadCount > 0 && (
                  <span className="text-sm bg-purple-600 px-3 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h1>
              <p className="text-zinc-400">
                Stay updated on tips, subscriptions, and platform news
              </p>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {isConnected ? (
            <>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Type Filter */}
                <div className="flex flex-wrap gap-2">
                  {(['all', 'tip', 'subscription', 'nft', 'checkin', 'system'] as NotificationFilter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        filter === f
                          ? 'bg-purple-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
                
                {/* Unread Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showUnreadOnly}
                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-zinc-400">Unread only</span>
                </label>
              </div>
              
              {/* Notifications List */}
              {filteredNotifications.length > 0 ? (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl transition-colors ${
                        notification.read
                          ? 'bg-zinc-900'
                          : 'bg-zinc-900 border-l-4 border-purple-500'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-2xl">{getIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className={`font-medium ${notification.read ? 'text-zinc-300' : 'text-white'}`}>
                                {notification.title}
                              </h3>
                              <p className="text-sm text-zinc-400 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-zinc-500 mt-2">
                                {notification.timestamp}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                                  title="Mark as read"
                                >
                                  ✓
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                                title="Delete"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              className="inline-block mt-3 text-sm text-purple-400 hover:text-purple-300"
                            >
                              View details →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-zinc-900 rounded-2xl">
                  <span className="text-4xl">📭</span>
                  <p className="text-zinc-400 mt-4">No notifications to show</p>
                </div>
              )}
              
              {/* Notification Settings Link */}
              <div className="mt-8 p-6 bg-zinc-900 rounded-2xl">
                <h3 className="font-semibold mb-2">Notification Preferences</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Customize which notifications you receive and how.
                </p>
                <a
                  href="/settings"
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  Go to Settings →
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-zinc-900 rounded-2xl">
              <span className="text-4xl">🔐</span>
              <p className="text-zinc-400 mt-4 mb-6">
                Connect your wallet to view notifications
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
