'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useUnreadCount } from '@/hooks/useNotifications';
import { useAuthStore } from '@/stores/useAuthStore';

export default function NotificationBell() {
  const user = useAuthStore((s) => s.user);
  const { data: unreadCount } = useUnreadCount();

  if (!user) return null;

  return (
    <Link href="/notifications" className="relative text-sm text-stone-400 transition hover:text-amber-300">
      <Bell className="h-5 w-5" />
      {(unreadCount ?? 0) > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {unreadCount! > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
