'use client';

import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  if (isLoading) return <div className="py-20 text-center text-neutral-400">Loading…</div>;

  const unreadCount = (notifications ?? []).filter((n) => !n.isRead).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead()}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Mark all read ({unreadCount})
          </button>
        )}
      </div>

      {!notifications?.length ? (
        <p className="text-neutral-400">No notifications.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && markRead(n.id)}
              className={`cursor-pointer rounded-lg border p-4 transition ${
                n.isRead
                  ? 'border-neutral-800 bg-neutral-900 opacity-60'
                  : 'border-blue-800 bg-neutral-900 hover:border-blue-600'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-white">{n.title}</p>
                  <p className="text-sm text-neutral-400">{n.message}</p>
                </div>
                <span className="shrink-0 text-xs text-neutral-500">
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
