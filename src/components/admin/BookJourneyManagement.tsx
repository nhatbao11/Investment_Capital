"use client";

import React, { useEffect, useRef, useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaPlus, FaTimes, FaBook, FaEnvelope } from 'react-icons/fa';
import { resolveFileUrl, resolvePdfUrl, getApiBaseUrl } from '../../utils/apiConfig';
import { useNotification } from '../ui/Notification';

type Status = 'draft' | 'published' | 'archived';

interface BookJourney {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  pdf_url: string;
  author_name?: string;
  status: Status;
  view_count: number;
  download_count: number;
  created_at: string;
}

interface Props {
  onClose: () => void;
  onSelectForNewsletter?: (book: BookJourney) => void;
}

const BookJourneyManagement: React.FC<Props> = ({ onClose, onSelectForNewsletter }) => {
  const { addNotification } = useNotification()
  const API_BASE = getApiBaseUrl();
  const [items, setItems] = useState<BookJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  const fetchAll = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
      const statusParam = statusFilter !== 'all' ? `&status=${statusFilter}` : '';
      const resp = await fetch(`${API_BASE}/bookjourney/admin/all?page=${page}&limit=${limit}${statusParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error('Fetch failed');
      const data = await resp.json();
      setItems(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch (e) {
      console.error('Load bookjourney failed:', e);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [page, limit, statusFilter]);

  // Auto fill table height with rows
  useEffect(() => {
    const calc = () => {
      if (typeof window === 'undefined') return
      const headerChrome = 360
      const rowH = 56
      const avail = Math.max(300, window.innerHeight - headerChrome)
      setLimit(Math.max(6, Math.floor(avail / rowH)))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const updateStatus = async (id: number, status: Status) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
      const body = JSON.stringify({ status });
      const resp = await fetch(`${API_BASE}/bookjourney/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body
      });
      if (resp.ok) {
        fetchAll();
        addNotification({
          type: 'success',
          title: 'Thành công',
          message: 'Đã cập nhật trạng thái thành công'
        });
      } else {
        const error = await resp.json();
        addNotification({
          type: 'error',
          title: 'Lỗi',
          message: error.message || 'Không thể cập nhật trạng thái'
        });
      }
    } catch (e) { 
      console.error(e);
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể cập nhật trạng thái'
      });
    }
  };


  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BookJourney | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{ title: string; description?: string; pdf_url: string; image_url?: string; status: Status }>({ title: '', description: '', pdf_url: '', image_url: '', status: 'draft' });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', pdf_url: '', image_url: '', status: 'draft' });
    setShowModal(true);
  };

  const openEdit = (b: BookJourney) => {
    setEditing(b);
    setForm({ title: b.title, description: b.description || '', pdf_url: b.pdf_url, image_url: b.image_url || '', status: b.status });
    setShowModal(true);
    setImageFiles([]);
    setPdfFile(null);
    setMessage(null);
  };

  const remove = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hành trình sách này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/bookjourney/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Thành công',
          message: 'Xóa hành trình sách thành công'
        });
        setItems(items.filter(item => item.id !== id));
      } else {
        const error = await response.json();
        addNotification({
          type: 'error',
          title: 'Lỗi',
          message: error.message || 'Không thể xóa hành trình sách'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể xóa hành trình sách'
      });
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `${API_BASE}/bookjourney/${editing.id}` : `${API_BASE}/bookjourney`;

      // Dùng FormData để hỗ trợ upload từ máy
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description || '');
      fd.append('status', form.status);
      if (imageFiles.length > 0) {
        imageFiles.forEach((f) => fd.append('images', f));
      } else if (form.image_url) {
        const url = form.image_url.trim();
        // Chỉ gửi image_url nếu là URL tuyệt đối, tránh fail validator khi là đường dẫn /uploads
        if (/^https?:\/\//i.test(url)) {
          fd.append('image_url', url);
        }
      }
      if (pdfFile) {
        fd.append('pdf', pdfFile);
      } else if (form.pdf_url) {
        const purl = form.pdf_url.trim();
        if (/^https?:\/\//i.test(purl)) {
          fd.append('pdf_url', purl);
        }
      }

      const resp = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      if (resp.ok) {
        const result = await resp.json();
        setMessage({ type: 'success', text: editing ? 'Cập nhật hành trình sách thành công' : 'Tạo hành trình sách thành công' });
        addNotification({
          type: 'success',
          title: 'Thành công',
          message: editing ? 'Cập nhật hành trình sách thành công' : 'Tạo hành trình sách thành công'
        })
        
        // Update form with returned URLs if available
        if (result.data) {
          if (result.data.image_url) {
            setForm(prev => ({ ...prev, image_url: result.data.image_url }));
          }
          if (result.data.pdf_url) {
            setForm(prev => ({ ...prev, pdf_url: result.data.pdf_url }));
          }
        }
        
        // Clear file selections and show URLs
        setImageFiles([]);
        setPdfFile(null);
        
        // Refresh the list
        await fetchAll();
        
        // Đóng sau một chút để người dùng thấy thông báo
        setTimeout(() => {
          setShowModal(false);
          setEditing(null);
          setMessage(null);
        }, 1500);
      } else {
        const t = await resp.text();
        setMessage({ type: 'error', text: t || 'Lưu thất bại' });
      }
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

    return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Quản lý Hành trình sách</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          onClick={openCreate}
        >
          <FaPlus className="h-4 w-4 mr-2" />
          Thêm hành trình mới
        </button>
      </div>

      {/* Filter Section */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
          <select
            value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published' | 'archived')}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">Tất cả</option>
              <option value="draft">Bản nháp</option>
              <option value="published">Đã xuất bản</option>
              <option value="archived">Đã lưu trữ</option>
            </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto" style={{ maxHeight: '60vh' }}>
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                    Lượt xem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                    Lượt tải
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((b) => (
                  <tr key={b.id}>
                    <td className="px-6 py-4 w-1/3">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {b.title}
                      </div>
                      {b.description && <div className="text-sm text-gray-500 truncate max-w-xs">{b.description}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap w-[10%]">
                      {b.image_url ? (
                        <img 
                          src={resolveFileUrl(b.image_url)} 
                          alt={b.title} 
                          className="h-16 w-16 object-cover rounded border border-gray-200" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      {!b.image_url && (
                        <div className="h-16 w-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                          <FaBook className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap w-[15%]">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        b.status === 'published' 
                          ? 'bg-green-100 text-green-800'
                          : b.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {b.status === 'published' ? 'Đã xuất bản' : 
                         b.status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[8%]">
                      {b.view_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-[8%]">
                      {b.download_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[15%]">
                      {new Date(b.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-[10%]">
                      <div className="flex items-center space-x-2">
                        {onSelectForNewsletter && b.status === 'published' && (
                          <button className="text-green-600 hover:text-green-900" title="Gửi newsletter" onClick={() => onSelectForNewsletter(b)}>
                            <FaEnvelope />
                          </button>
                        )}
                        <button className="text-blue-600 hover:text-blue-900" title="Sửa" onClick={() => openEdit(b)}><FaEdit /></button>
                        <button className="text-red-600 hover:text-red-900" title="Xóa" onClick={() => remove(b.id)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button onClick={() => { if (page > 1) setPage(page - 1); }} disabled={page <= 1} className="px-3 py-2 border rounded disabled:opacity-50">Trang trước</button>
        <div className="text-sm text-gray-600">Trang {page}{total ? ` / ${Math.max(1, Math.ceil(total / limit))}` : ''}</div>
        <button onClick={() => { const max = Math.max(1, Math.ceil(total / limit)); if (page < max) setPage(page + 1); }} className="px-3 py-2 border rounded">Trang sau</button>
      </div>
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) { setShowModal(false); setEditing(null); }
          }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header (giống IK) */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Chỉnh sửa hành trình sách' : 'Thêm hành trình sách'}</h2>
              <button onClick={() => { setShowModal(false); setEditing(null); }} className="text-gray-400 hover:text-gray-600">
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={submit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {message && (
                <div className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{message.text}</div>
              )}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh đại diện (URL hoặc upload)</label>
              <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  placeholder="https://example.com/image.jpg hoặc /uploads/posts/abc.jpg"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                />
                <button type="button" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200" onClick={() => imageInputRef.current?.click()}>Tải ảnh từ máy</button>
                <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setImageFiles(files);
                  // Clear URL input when files are selected
                  if (files.length > 0) {
                    setForm(prev => ({ ...prev, image_url: '' }));
                  }
                }} />
                {(imageFiles.length > 0 || editing?.image_url) && (
                  <div className="mt-3">
                    <div className="grid grid-cols-3 gap-2">
                      {imageFiles.length > 0
                        ? imageFiles.map((f, idx) => (
                            <div key={idx} className="relative">
                              <img src={URL.createObjectURL(f)} alt={f.name} className="h-24 w-full object-cover rounded" />
                              <button
                                type="button"
                                onClick={() => {
                                  setImageFiles([]);
                                  if (imageInputRef.current) imageInputRef.current.value = '';
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))
                        : (
                            <img src={editing!.image_url!.startsWith('http') ? editing!.image_url! : `${API_BASE}${editing!.image_url!}` } alt={editing?.title} className="h-24 w-20 object-cover rounded" />
                          )}
                    </div>
                    {imageFiles.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        <button
                          type="button"
                          onClick={() => {
                            setImageFiles([]);
                            if (imageInputRef.current) imageInputRef.current.value = '';
                          }}
                          className="text-red-600 hover:underline"
                        >
                          Xóa ảnh đã chọn
                        </button>
                      </div>
                    )}
                  </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tập tin PDF (URL hoặc upload)</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  placeholder="https://example.com/report.pdf hoặc /uploads/posts/report.pdf"
                  value={form.pdf_url}
                  onChange={(e) => setForm({ ...form, pdf_url: e.target.value })}
                />
                <button type="button" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200" onClick={() => pdfInputRef.current?.click()}>Tải PDF từ máy</button>
                <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setPdfFile(file);
                  // Clear URL input when file is selected
                  if (file) {
                    setForm(prev => ({ ...prev, pdf_url: '' }));
                  }
                }} />
                {pdfFile && (
                  <div className="mt-2 p-2 bg-gray-50 rounded border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">📄 {pdfFile.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPdfFile(null);
                          if (pdfInputRef.current) pdfInputRef.current.value = '';
                        }}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                )}
                {!pdfFile && editing?.pdf_url && (
                  <div className="mt-2 text-sm">
                    <button type="button" className="text-blue-600 hover:underline" onClick={() => window.open(editing.pdf_url.startsWith('http') ? editing.pdf_url : `${API_BASE}${editing.pdf_url}`, '_blank')}>Xem PDF hiện tại</button>
                  </div>
                )}
                </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}>
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="archived">Lưu trữ</option>
                </select>
                </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={saving}>{saving ? 'Đang lưu...' : (editing ? 'Cập nhật' : 'Tạo mới')}</button>
              </div>
            </form>
              </div>
            </div>
      )}
    </div>
  );
};

export default BookJourneyManagement;

