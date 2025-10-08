"use client"

import React, { useState, useRef, useEffect } from 'react';
import { FaImage, FaTimes, FaUpload } from 'react-icons/fa';
import { apiClient } from '../../services/api/client';

interface ImageUploaderProps {
  onImagesChange: (images: string[]) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesChange,
  disabled = false
}) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      // Upload ảnh thật của user lên server
      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} không phải là ảnh. Vui lòng chọn file ảnh.`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} quá lớn. Vui lòng chọn file nhỏ hơn 5MB.`);
          continue;
        }

        // Upload to server - try both methods
        const formData = new FormData();
        formData.append('image', file);

        try {
          console.log('Starting upload for file:', file.name, file.size, file.type);
          
          // First try with direct fetch to see if it's an apiClient issue
          const token = localStorage.getItem('access_token');
          console.log('Token exists:', !!token);
          
          const response = await fetch('http://localhost:5000/api/v1/upload/test-upload', {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
            },
            credentials: 'include'
          });

          console.log('Response status:', response.status);
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }

          const result = await response.json();
          console.log('Upload result:', result);
          
          if (result.success) {
            uploadedUrls.push(result.data.url);
            console.log('Upload successful, URL:', result.data.url);
          } else {
            throw new Error(result.message || 'Upload failed');
          }
        } catch (error: any) {
          console.error('Upload error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
          });
          
          throw new Error(`Upload failed: ${error.message}`);
        }
      }
      
      const newImages = [...selectedImages, ...uploadedUrls];
      setSelectedImages(newImages);
      onImagesChange(newImages);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.message || 'Lỗi không xác định';
      alert(`Lỗi khi upload ảnh: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    // Clean up object URL to prevent memory leak
    const imageUrl = selectedImages[index];
    if (imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    onImagesChange(newImages);
  };

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      selectedImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div
        onClick={openFileDialog}
        className={`flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500'
        }`}
      >
        <div className="text-center">
          <FaImage className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {uploading ? 'Đang upload...' : 'Nhấp để chọn ảnh (có thể chọn nhiều)'}
          </p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {selectedImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Preview ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
              />
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                disabled={disabled}
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Help text */}
      <div className="text-xs text-gray-500 space-y-1">
        <div>💡 Mẹo: Chọn nhiều ảnh cùng lúc. Ảnh đầu tiên sẽ được sử dụng làm ảnh chính.</div>
        <div>📝 Lưu ý: Bạn có thể tạo bài viết không có ảnh nếu muốn.</div>
        <div className="text-yellow-600">⚠️ Nếu upload lỗi, bạn vẫn có thể lưu bài viết mà không có ảnh.</div>
      </div>
    </div>
  );
};

export default ImageUploader;
