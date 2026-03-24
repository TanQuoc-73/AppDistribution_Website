'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/api/endpoints';
import Modal from '@/components/ui/Modal';
import type { Profile, UserRole } from '@/types';

interface PaginatedUsers {
  data: Profile[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

const roleBadge: Record<string, string> = {
  user:      'bg-stone-700 text-stone-300',
  developer: 'bg-emerald-900/60 text-emerald-300',
  admin:     'bg-rose-900/60 text-rose-300',
};

export default function AdminUsersPage() {
  const [result, setResult] = useState<PaginatedUsers | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const [editForm, setEditForm] = useState({ username: '', displayName: '', bio: '', role: 'user' as string });
  const [saving, setSaving] = useState(false);

  const fetchUsers = (p: number) => {
    setLoading(true);
    adminApi
      .getUsers({ page: p, limit: 20 })
      .then((res) => setResult({ data: res.data.data, meta: res.data.meta }))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(page); }, [page]);

  function openEdit(u: Profile) {
    setEditUser(u);
    setEditForm({
      username: u.username,
      displayName: u.displayName ?? '',
      bio: u.bio ?? '',
      role: u.role,
    });
  }

  async function handleSaveUser() {
    if (!editUser) return;
    setSaving(true);
    try {
      await adminApi.updateUser(editUser.id, {
        username: editForm.username,
        displayName: editForm.displayName || undefined,
        bio: editForm.bio || undefined,
        role: editForm.role,
      });
      setEditUser(null);
      fetchUsers(page);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(id: string, username: string, active: boolean) {
    if (!confirm(`${active ? 'Vô hiệu hoá' : 'Kích hoạt'} tài khoản "${username}"?`)) return;
    try {
      await adminApi.toggleUserActive(id);
      fetchUsers(page);
    } catch {}
  }

  async function handleDelete(id: string, username: string) {
    if (!confirm(`Xoá tài khoản "${username}"? Hành động này không thể hoàn tác.`)) return;
    try {
      await adminApi.deleteUser(id);
      fetchUsers(page);
    } catch {}
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-100">Users</h1>
        <span className="text-sm text-stone-500">{result?.meta.total ?? 0} total</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-800">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-800 bg-stone-900/80 text-left text-stone-400">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Display Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Wallet</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7} className="px-4 py-3">
                    <div className="h-5 w-full animate-pulse rounded bg-stone-800" />
                  </td>
                </tr>
              ))
            ) : result?.data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-stone-500">
                  Không có người dùng
                </td>
              </tr>
            ) : (
              result?.data.map((u) => {
                const active = u.isActive !== false && (u as any).is_active !== false;
                return (
                  <tr key={u.id} className="hover:bg-stone-900/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {u.avatarUrl ? (
                          <img src={u.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-600/20 text-xs font-bold text-amber-400">
                            {u.username[0]?.toUpperCase() ?? '?'}
                          </div>
                        )}
                        <span className="font-medium text-stone-200">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-400">{u.displayName ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge[u.role] ?? roleBadge.user}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(u.id, u.username, active)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          active
                            ? 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-900'
                            : 'bg-red-900/60 text-red-300 hover:bg-red-900'
                        }`}
                      >
                        {active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-stone-400">${Number(u.walletBalance).toFixed(2)}</td>
                    <td className="px-4 py-3 text-stone-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(u)}
                          className="rounded p-1.5 text-stone-400 transition hover:bg-amber-900/30 hover:text-amber-300"
                          title="Sửa"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.username)}
                          className="rounded p-1.5 text-stone-400 transition hover:bg-red-900/30 hover:text-red-400"
                          title="Xoá"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {result && result.meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-stone-700 px-3 py-1.5 text-sm text-stone-300 transition hover:bg-stone-800 disabled:opacity-40"
          >
            Trước
          </button>
          <span className="text-sm text-stone-500">{page} / {result.meta.totalPages}</span>
          <button
            disabled={page >= result.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-stone-700 px-3 py-1.5 text-sm text-stone-300 transition hover:bg-stone-800 disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      )}

      {/* Edit User Modal */}
      <Modal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title="Sửa thông tin người dùng"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSaveUser(); }} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-stone-400">Username</label>
            <input
              value={editForm.username}
              onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))}
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-stone-400">Display Name</label>
            <input
              value={editForm.displayName}
              onChange={(e) => setEditForm((f) => ({ ...f, displayName: e.target.value }))}
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-stone-400">Bio</label>
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-stone-400">Role</label>
            <select
              value={editForm.role}
              onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full rounded-lg border border-stone-700 bg-stone-800/60 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
            >
              <option value="user">user</option>
              <option value="developer">developer</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditUser(null)}
              className="rounded-lg border border-stone-700 px-4 py-2 text-sm text-stone-300 transition hover:bg-stone-800"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-amber-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50"
            >
              {saving ? 'Đang lưu…' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
