"use client"

import React, { useState, useEffect } from 'react';
import { FaTimes, FaImage, FaSave, FaSpinner } from 'react-icons/fa';
// import SimpleEditor from './SimpleEditor';
import ImageUploader from './ImageUploader';

interface InvestmentKnowledge {
  id?: number;
  title: string;
  image_url?: string;
  images?: string[];
  content: string;
  meaning?: string;
  status: 'draft' | 'published' | 'archived';
}


interface InvestmentKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InvestmentKnowledge) => Promise<void>;
  knowledge?: InvestmentKnowledge | null;
  loading?: boolean;
}

const InvestmentKnowledgeModal: React.FC<InvestmentKnowledgeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  knowledge,
  loading = false
}) => {
  const [formData, setFormData] = useState<InvestmentKnowledge>({
    title: '',
    image_url: '',
    content: '',
    meaning: '',
    status: 'draft'
  });
  const [saving, setSaving] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    if (knowledge) {
      setFormData({
        title: knowledge.title || '',
        image_url: knowledge.image_url || '',
        content: knowledge.content || '',
        meaning: knowledge.meaning || '',
        status: knowledge.status || 'draft'
      });
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
        content: '',
        meaning: '',
        status: 'draft'
      });
    }
    
    // Reset selected images when modal opens
    if (isOpen) {
      setSelectedImages([]);
    }
  }, [knowledge, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      await onSave(formData);
      try { alert(knowledge ? 'Cập nhật kiến thức đầu tư thành công' : 'Tạo kiến thức đầu tư thành công') } catch {}
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

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung *
            </label>
            <textarea
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Nhập nội dung chi tiết..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={saving}
            />
            <div className="text-xs text-gray-500 mt-2 space-y-1">
              <div className="font-semibold text-blue-600">💡 Hướng dẫn định dạng:</div>
              <div>• <strong>**Tiêu đề chính**</strong> → Tiêu đề lớn nhất</div>
              <div>• <strong>*Tiêu đề phụ*</strong> → Tiêu đề vừa</div>
              <div>• <strong>Enter</strong> → Xuống dòng tạo đoạn mới</div>
              <div className="text-green-600 font-medium">✨ Tự động in đậm: Lý thuyết Dow, xu hướng, thị trường, giá cổ phiếu, Sóng Elliott, Fibonacci, chu kỳ, tâm lý, bong bóng...</div>
            </div>
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
