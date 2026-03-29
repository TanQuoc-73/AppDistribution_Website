"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { adminApi } from "@/lib/api/endpoints";
import Modal from "@/components/ui/Modal";
import type { Product, ProductVersion } from "@/types";

export default function AdminProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [versions, setVersions] = useState<ProductVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [versionForm, setVersionForm] = useState({
    version: "",
    downloadUrl: "",
    fileSize: "",
    changelog: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editVersionId, setEditVersionId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ version: '', downloadUrl: '', fileSize: '', changelog: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  function openEditVersion(v: ProductVersion) {
    setEditVersionId(v.id);
    setEditForm({
      version: v.version,
      downloadUrl: v.downloadUrl || '',
      fileSize: v.fileSize?.toString() || '',
      changelog: v.changelog || '',
    });
    setEditModalOpen(true);
    setError(null);
  }

  async function handleEditVersion() {
    if (!editVersionId) return;
    setSaving(true);
    setError(null);
    try {
      await adminApi.updateProductVersion(id as string, editVersionId, {
        version: editForm.version,
        downloadUrl: editForm.downloadUrl,
        fileSize: editForm.fileSize ? Number(editForm.fileSize) : undefined,
        changelog: editForm.changelog,
      });
      setEditModalOpen(false);
      setEditVersionId(null);
      const res = await adminApi.getProductVersions(id as string);
      setVersions(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Lỗi khi cập nhật version');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteVersion() {
    if (!deleteConfirm.id) return;
    setSaving(true);
    setError(null);
    try {
      await adminApi.deleteProductVersion(id as string, deleteConfirm.id);
      setDeleteConfirm({ open: false, id: null });
      const res = await adminApi.getProductVersions(id as string);
      setVersions(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Lỗi khi xóa version');
    } finally {
      setSaving(false);
    }
  }

  async function handleSetLatest(versionId: string) {
    setSaving(true);
    setError(null);
    try {
      await adminApi.setProductVersionLatest(versionId);
      const res = await adminApi.getProductVersions(id as string);
      setVersions(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Lỗi khi đặt version mới nhất');
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    adminApi.getProductById(id as string)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
    adminApi.getProductVersions(id as string)
      .then((res) => setVersions(res.data))
      .catch(() => setVersions([]));
  }, [id]);

  function openAddVersion() {
    setVersionForm({ version: "", downloadUrl: "", fileSize: "", changelog: "" });
    setError(null);
    setVersionModalOpen(true);
  }

  async function handleAddVersion() {
    setSaving(true);
    setError(null);
    try {
      await adminApi.createProductVersion(id as string, {
        version: versionForm.version,
        downloadUrl: versionForm.downloadUrl,
        fileSize: versionForm.fileSize ? Number(versionForm.fileSize) : undefined,
        changelog: versionForm.changelog,
      });
      setVersionModalOpen(false);
      // Refresh versions
      const res = await adminApi.getProductVersions(id as string);
      setVersions(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Lỗi khi thêm version");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Chi tiết sản phẩm</h1>
      {loading ? (
        <div>Đang tải...</div>
      ) : product ? (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold">Thông tin sản phẩm</h2>
            <div className="mt-2">Tên: {product.name}</div>
            <div>Slug: {product.slug}</div>
            <div>Mô tả: {product.description}</div>
            {/* ...other fields... */}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Các phiên bản (Versions)</h2>
              <button className="btn btn-primary" onClick={openAddVersion}>Thêm Version</button>
            </div>
            <table className="table-auto w-full border">
              <thead>
                <tr>
                  <th>Version</th>
                  <th>File Size</th>
                  <th>Latest</th>
                  <th>Created At</th>
                  <th>Changelog</th>
                </tr>
              </thead>
              <tbody>
                {versions.map((v) => (
                  <tr key={v.id} className={v.isLatest ? "bg-green-50" : ""}>
                    <td>{v.version}</td>
                    <td>{v.fileSize ? `${(v.fileSize / (1024*1024)).toFixed(1)} MB` : ""}</td>
                    <td>{v.isLatest ? "✓" : ""}</td>
                    <td>{v.createdAt ? new Date(v.createdAt).toLocaleString() : ""}</td>
                    <td>{v.changelog || ""}</td>
                    <td>
                      <div className="flex gap-2">
                        <button title="Sửa" onClick={() => openEditVersion(v)} className="btn btn-xs btn-outline"><Pencil className="w-4 h-4" /></button>
                        <button title="Xóa" onClick={() => setDeleteConfirm({ open: true, id: v.id })} className="btn btn-xs btn-outline"><Trash2 className="w-4 h-4" /></button>
                        {!v.isLatest && (
                          <button title="Đặt là mới nhất" onClick={() => handleSetLatest(v.id)} className="btn btn-xs btn-outline"><Star className="w-4 h-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                    {/* Edit Version Modal */}
                    <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Sửa Version">
                      <div className="space-y-4">
                        <input
                          className="input input-bordered w-full"
                          placeholder="Version (e.g. 1.2.0)"
                          value={editForm.version}
                          onChange={e => setEditForm(f => ({ ...f, version: e.target.value }))}
                        />
                        <input
                          className="input input-bordered w-full"
                          placeholder="Download URL"
                          value={editForm.downloadUrl}
                          onChange={e => setEditForm(f => ({ ...f, downloadUrl: e.target.value }))}
                        />
                        <input
                          className="input input-bordered w-full"
                          placeholder="File size (bytes)"
                          value={editForm.fileSize}
                          onChange={e => setEditForm(f => ({ ...f, fileSize: e.target.value }))}
                        />
                        <textarea
                          className="textarea textarea-bordered w-full"
                          placeholder="Changelog (optional)"
                          value={editForm.changelog}
                          onChange={e => setEditForm(f => ({ ...f, changelog: e.target.value }))}
                        />
                        {error && <div className="text-red-500">{error}</div>}
                        <button className="btn btn-primary w-full" onClick={handleEditVersion} disabled={saving}>
                          {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                      </div>
                    </Modal>

                    {/* Delete Version Confirm Modal */}
                    <Modal open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, id: null })} title="Xác nhận xóa version">
                      <div className="space-y-4">
                        <div>Bạn có chắc chắn muốn xóa version này?</div>
                        {error && <div className="text-red-500">{error}</div>}
                        <div className="flex gap-2">
                          <button className="btn btn-error" onClick={handleDeleteVersion} disabled={saving}>Xóa</button>
                          <button className="btn" onClick={() => setDeleteConfirm({ open: false, id: null })}>Hủy</button>
                        </div>
                      </div>
                    </Modal>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div>Không tìm thấy sản phẩm</div>
      )}
      <Modal open={versionModalOpen} onClose={() => setVersionModalOpen(false)} title="Thêm Version mới">
        <div className="space-y-4">
          <input
            className="input input-bordered w-full"
            placeholder="Version (e.g. 1.2.0)"
            value={versionForm.version}
            onChange={e => setVersionForm(f => ({ ...f, version: e.target.value }))}
          />
          <input
            className="input input-bordered w-full"
            placeholder="Download URL"
            value={versionForm.downloadUrl}
            onChange={e => setVersionForm(f => ({ ...f, downloadUrl: e.target.value }))}
          />
          <input
            className="input input-bordered w-full"
            placeholder="File size (bytes)"
            value={versionForm.fileSize}
            onChange={e => setVersionForm(f => ({ ...f, fileSize: e.target.value }))}
          />
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Changelog (optional)"
            value={versionForm.changelog}
            onChange={e => setVersionForm(f => ({ ...f, changelog: e.target.value }))}
          />
          {error && <div className="text-red-500">{error}</div>}
          <button className="btn btn-primary w-full" onClick={handleAddVersion} disabled={saving}>
            {saving ? "Đang lưu..." : "Thêm Version"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
