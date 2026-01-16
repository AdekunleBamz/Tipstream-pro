/**
 * Notifications API Route
 * 
 * Handles notification management:
 * - GET: Retrieve user notifications
 * - POST: Create new notification
 * - PATCH: Update notification (mark as read)
 * - DELETE: Delete notifications
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Notification types
type NotificationType = 'tip_received' | 'tip_sent' | 'subscription' | 'nft_minted' | 'checkin' | 'streak_milestone' | 'system';

interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
}

// Mock notifications database
const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    userId: '0x1234567890123456789012345678901234567890',
    type: 'tip_received',
    title: 'New Tip Received!',
    message: 'alice.eth sent you 0.05 ETH',
    data: { from: 'alice.eth', amount: '0.05', currency: 'ETH' },
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: 'notif_2',
    userId: '0x1234567890123456789012345678901234567890',
    type: 'subscription',
    title: 'New Subscriber',
    message: 'bob.eth subscribed to your Pro tier',
    data: { subscriber: 'bob.eth', tier: 'pro' },
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

/**
 * GET /api/notifications
 * 
 * Query params:
 * - userId: User's wallet address (required)
 * - type: Filter by notification type
 * - read: Filter by read status (true/false)
 * - limit: Max results (default: 50)
 * - offset: Pagination offset
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') as NotificationType | null;
    const readStatus = searchParams.get('read');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }
    
    // Filter notifications
    let filtered = mockNotifications.filter(n => n.userId.toLowerCase() === userId.toLowerCase());
    
    if (type) {
      filtered = filtered.filter(n => n.type === type);
    }
    
    if (readStatus !== null) {
      const isRead = readStatus === 'true';
      filtered = filtered.filter(n => n.read === isRead);
    }
    
    // Sort by createdAt descending
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Calculate unread count
    const unreadCount = mockNotifications.filter(
      n => n.userId.toLowerCase() === userId.toLowerCase() && !n.read
    ).length;
    
    // Paginate
    const total = filtered.length;
    const notifications = filtered.slice(offset, offset + limit);
    
    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * 
 * Create a new notification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, title, message, data } = body;
    
    // Validation
    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, type, title, message' },
        { status: 400 }
      );
    }
    
    const validTypes: NotificationType[] = [
      'tip_received', 'tip_sent', 'subscription', 'nft_minted', 'checkin', 'streak_milestone', 'system'
    ];
    
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid type. Valid types: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    const notification: Notification = {
      id: `notif_${Date.now()}`,
      userId,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    mockNotifications.push(notification);
    
    return NextResponse.json({
      success: true,
      data: { notification },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notifications
 * 
 * Update notifications (mark as read)
 * Body: { ids: string[], read: boolean }
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, read } = body;
    
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { success: false, error: 'ids array is required' },
        { status: 400 }
      );
    }
    
    let updatedCount = 0;
    
    for (const id of ids) {
      const notification = mockNotifications.find(n => n.id === id);
      if (notification) {
        notification.read = read ?? true;
        updatedCount++;
      }
    }
    
    return NextResponse.json({
      success: true,
      data: { updatedCount },
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications
 * 
 * Delete notifications
 * Query params: ids (comma-separated) or all=true (for clearing all)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const idsParam = searchParams.get('ids');
    const clearAll = searchParams.get('all') === 'true';
    const userId = searchParams.get('userId');
    
    if (!idsParam && !clearAll) {
      return NextResponse.json(
        { success: false, error: 'Either ids or all=true is required' },
        { status: 400 }
      );
    }
    
    let deletedCount = 0;
    
    if (clearAll && userId) {
      // Clear all notifications for user
      const initialLength = mockNotifications.length;
      const remaining = mockNotifications.filter(
        n => n.userId.toLowerCase() !== userId.toLowerCase()
      );
      deletedCount = initialLength - remaining.length;
      mockNotifications.length = 0;
      mockNotifications.push(...remaining);
    } else if (idsParam) {
      // Delete specific notifications
      const ids = idsParam.split(',');
      const initialLength = mockNotifications.length;
      const remaining = mockNotifications.filter(n => !ids.includes(n.id));
      deletedCount = initialLength - remaining.length;
      mockNotifications.length = 0;
      mockNotifications.push(...remaining);
    }
    
    return NextResponse.json({
      success: true,
      data: { deletedCount },
    });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete notifications' },
      { status: 500 }
    );
  }
}
