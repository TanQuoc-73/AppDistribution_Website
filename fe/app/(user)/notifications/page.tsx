'use client';

import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { Bell, Check, CheckCheck } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  const items = notifications ?? [];
  const unreadCount = items.filter((n: any) => !n.isRead).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-amber-400" />
          <h1 className="text-2xl font-bold text-amber-50">Notifications</h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-medium text-red-400">
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead()}
            className="flex items-center gap-1.5 rounded-lg bg-amber-600/10 px-3 py-1.5 text-sm font-medium text-amber-300 transition hover:bg-amber-600/20"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        )}
      </div>

      {!items.length ? (
        <div className="rounded-xl border border-amber-900/20 bg-amber-950/10 py-16 text-center">
          <Bell className="mx-auto mb-3 h-10 w-10 text-amber-800/40" />
          <p className="text-amber-400/50">No notifications yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((n: any) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && markRead(n.id)}
              className={`group cursor-pointer rounded-xl border p-4 transition ${
                n.isRead
                  ? 'border-amber-900/15 bg-amber-950/5 opacity-60'
                  : 'border-amber-700/25 bg-amber-950/20 hover:border-amber-600/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    n.isRead ? 'bg-amber-900/10' : 'bg-amber-600/15'
                  }`}>
                    {n.isRead ? (
                      <Check className="h-4 w-4 text-amber-600/40" />
                    ) : (
                      <Bell className="h-4 w-4 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-amber-50">{n.title}</p>
                    <p className="mt-0.5 text-sm text-amber-100/50">{n.message}</p>
                    {n.link_url && (
                      <Link
                        href={n.link_url}
                        className="mt-1 inline-block text-xs text-amber-400/60 transition hover:text-amber-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View details →
                      </Link>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-xs text-amber-400/30">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
