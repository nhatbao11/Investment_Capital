"use client"

import React, { useState, useEffect } from 'react';
import { FaTimes, FaImage, FaSave, FaSpinner } from 'react-icons/fa';
// import SimpleEditor from './SimpleEditor';
import ImageUploader from './ImageUploader';
import { categoriesAPI, Category } from '../../services/api/categories';
import { useNotification } from '../ui/Notification';

interface InvestmentKnowledgeForm {
  id?: number;
  title: string;
  image_url?: string;
  images?: string[];
  meaning?: string;
  status: 'draft' | 'published' | 'archived';
  pdf_url?: string;
  category_id?: number;
}

interface InvestmentKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  knowledge?: any | null;
  loading?: boolean;
}

const InvestmentKnowledgeModal: React.FC<InvestmentKnowledgeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  knowledge,
  loading = false
}) => {
  const { addNotification } = useNotification()
  const [formData, setFormData] = useState<InvestmentKnowledgeForm>({
    title: '',
    image_url: '',
    meaning: '',
    status: 'draft',
    category_id: undefined
  });
  const [saving, setSaving] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoriesAPI.getAll();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (knowledge) {
      setFormData({
        title: knowledge.title || '',
        image_url: knowledge.image_url || '',
        meaning: knowledge.meaning || '',
        status: knowledge.status || 'draft',
        category_id: (knowledge as any).category_id || undefined
      });
      
      // Set PDF URL if exists (for editing)
      setPdfUrl(knowledge.content || '');
      
      // Prefill selected images for preview when editing
      const initialImages: string[] = [];
      if (Array.isArray((knowledge as any).images)) {
        initialImages.push(...((knowledge as any).images as string[]));
      }
      if (knowledge.image_url) {
        initialImages.unshift(knowledge.image_url);
      }
      setSelectedImages(initialImages);
    } else {
      setFormData({
        title: '',
        image_url: '',
        meaning: '',
        status: 'draft',
        category_id: undefined
      });
      setPdfFile(null);
      setPdfUrl('');
    }
    
    // Don't reset selected images when editing - keep existing ones
    if (isOpen && !knowledge) {
      setSelectedImages([]);
    }
  }, [knowledge, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      
      // Validate required fields
      if (!formData.title.trim()) {
        addNotification({
          type: 'warning',
          title: 'Cảnh báo',
          message: 'Vui lòng nhập tiêu đề'
        });
        return;
      }

      // For new knowledge, PDF is required
      if (!knowledge && !pdfFile && !pdfUrl.trim()) {
        addNotification({
          type: 'warning',
          title: 'Cảnh báo',
          message: 'Vui lòng chọn file PDF hoặc nhập URL PDF'
        });
        return;
      }

      const fd = new FormData();
      fd.append('title', formData.title.trim());
      if (formData.image_url) fd.append('image_url', formData.image_url);
      if (formData.meaning) fd.append('meaning', formData.meaning);
      fd.append('status', formData.status);
      if (formData.category_id) fd.append('category_id', formData.category_id.toString());
      
      // Handle PDF: new file upload takes priority, then URL (only if changed)
      if (pdfFile) {
        fd.append('pdf', pdfFile);
      } else if (pdfUrl.trim() && pdfUrl.trim() !== (knowledge?.content || '')) {
        // Only send pdf_url if it's different from existing content
        fd.append('pdf_url', pdfUrl.trim());
      }
      // If editing and no new PDF provided, keep existing PDF (no need to send anything)
      
      await onSave(fd);
    } catch (error) {
      console.error('Error saving investment knowledge:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImagesChange = (images: string[]) => {
    setSelectedImages(images);
    // Set first image as main image and all images
    if (images.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        image_url: images[0],
        images: images 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        image_url: '',
        images: []
      }));
    }
  };

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      selectedImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [selectedImages]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {knowledge ? 'Chỉnh sửa kiến thức đầu tư' : 'Thêm kiến thức đầu tư mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={saving}
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tiêu đề kiến thức đầu tư"
              disabled={saving}
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <div className="space-y-3">
              <select
                value={formData.category_id || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'new') {
                    setShowNewCategory(true);
                    setFormData(prev => ({ ...prev, category_id: undefined }));
                  } else {
                    setShowNewCategory(false);
                    setFormData(prev => ({ ...prev, category_id: value ? parseInt(value) : undefined }));
                  }
                }}
                disabled={saving}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
                <option value="new">+ Tạo danh mục mới</option>
              </select>

              {showNewCategory && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Tên danh mục mới"
                    disabled={saving}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (newCategoryName.trim()) {
                        try {
                          const newCategory = await categoriesAPI.create({
                            name: newCategoryName.trim(),
                            color: '#3b82f6'
                          });
                          setCategories(prev => [...prev, newCategory]);
                          setFormData(prev => ({ ...prev, category_id: newCategory.id }));
                          setNewCategoryName('');
                          setShowNewCategory(false);
                        } catch (error) {
                          addNotification({
                            type: 'error',
                            title: 'Lỗi',
                            message: 'Lỗi tạo danh mục: ' + (error as Error).message
                          });
                        }
                      }
                    }}
                    disabled={saving || !newCategoryName.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Tạo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh minh họa (có thể chọn nhiều ảnh)
            </label>
            {/* Preview existing images when editing */}
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {selectedImages.map((src, idx) => (
                  <img key={idx} src={src} alt={`preview-${idx}`} className="h-24 w-full object-cover rounded" />
                ))}
              </div>
            )}
            <ImageUploader
              onImagesChange={handleImagesChange}
              disabled={saving}
            />
          </div>

          {/* PDF Upload / URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File PDF kiến thức đầu tư {!knowledge && '(bắt buộc)'}
            </label>
            
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
          disabled={saving}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <div className="text-xs text-gray-500 mt-2 mb-3">
          {knowledge ? 'Chọn file mới để thay thế PDF hiện tại (không bắt buộc)' : 'Hoặc dán URL PDF (Google Drive, Dropbox, v.v.)'}
        </div>
        <input
          type="text"
          placeholder={knowledge ? "Giữ nguyên PDF hiện tại hoặc nhập URL mới..." : "https://drive.google.com/file/d/... hoặc https://..."}
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
          disabled={saving}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
          </div>

          {/* Meaning */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ý nghĩa
            </label>
            <textarea
              rows={4}
              value={formData.meaning}
              onChange={(e) => setFormData(prev => ({ ...prev, meaning: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập ý nghĩa của kiến thức này"
              disabled={saving}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={saving}
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Đã xuất bản</option>
              <option value="archived">Lưu trữ</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={saving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              disabled={saving}
            >
              {saving ? (
                <>
                  <FaSpinner className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <FaSave className="h-4 w-4 mr-2" />
                  {knowledge ? 'Cập nhật' : 'Tạo mới'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentKnowledgeModal;
