"use client"

import React, { useRef, useState } from 'react';
import { FaBold, FaItalic, FaListUl, FaListOl, FaQuoteLeft, FaLink } from 'react-icons/fa';

interface SimpleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  disabled = false
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const execCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      // Force update after command
      setTimeout(() => {
        updateContent();
      }, 10);
    }
  };

  const updateContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    setTimeout(() => updateContent(), 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Enter key to create new paragraphs
    if (e.key === 'Enter') {
      setTimeout(() => updateContent(), 10);
    }
  };

  const insertList = (type: 'ul' | 'ol') => {
    execCommand('insertUnorderedList');
  };

  const insertQuote = () => {
    execCommand('formatBlock', 'blockquote');
  };

  const insertLink = () => {
    const url = prompt('Nhập URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertHeading = (level: number) => {
    execCommand('formatBlock', `h${level}`);
  };

  const insertParagraph = () => {
    execCommand('formatBlock', 'p');
  };

  const clearFormatting = () => {
    execCommand('removeFormat');
  };

  const insertLineBreak = () => {
    execCommand('insertHTML', '<br>');
  };

  const undo = () => {
    execCommand('undo');
  };

  const redo = () => {
    execCommand('redo');
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="In đậm"
          disabled={disabled}
        >
          <FaBold className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="In nghiêng"
          disabled={disabled}
        >
          <FaItalic className="h-4 w-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => insertList('ul')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Danh sách không thứ tự"
          disabled={disabled}
        >
          <FaListUl className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => insertList('ol')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Danh sách có thứ tự"
          disabled={disabled}
        >
          <FaListOl className="h-4 w-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={insertQuote}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Trích dẫn"
          disabled={disabled}
        >
          <FaQuoteLeft className="h-4 w-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => insertHeading(3)}
          className="p-2 hover:bg-gray-200 rounded transition-colors text-sm font-bold"
          title="Tiêu đề 3"
          disabled={disabled}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => insertHeading(4)}
          className="p-2 hover:bg-gray-200 rounded transition-colors text-sm font-bold"
          title="Tiêu đề 4"
          disabled={disabled}
        >
          H4
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={insertParagraph}
          className="p-2 hover:bg-gray-200 rounded transition-colors text-sm"
          title="Đoạn văn"
          disabled={disabled}
        >
          P
        </button>
        
        <button
          type="button"
          onClick={clearFormatting}
          className="p-2 hover:bg-gray-200 rounded transition-colors text-sm"
          title="Xóa định dạng"
          disabled={disabled}
        >
          Clear
        </button>
        
        <button
          type="button"
          onClick={insertLink}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Chèn link"
          disabled={disabled}
        >
          <FaLink className="h-4 w-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={undo}
          className="p-2 hover:bg-gray-200 rounded transition-colors text-sm"
          title="Hoàn tác"
          disabled={disabled}
        >
          ↶
        </button>
        
        <button
          type="button"
          onClick={redo}
          className="p-2 hover:bg-gray-200 rounded transition-colors text-sm"
          title="Làm lại"
          disabled={disabled}
        >
          ↷
        </button>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={updateContent}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`min-h-[200px] p-4 focus:outline-none ${
            isFocused ? 'ring-2 ring-blue-500' : ''
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          style={{
            minHeight: '200px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }}
          dangerouslySetInnerHTML={{ __html: value }}
        />

        {/* Placeholder */}
        {!value && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="bg-blue-50 border-t border-blue-200 p-3 text-xs text-blue-700">
        <div className="font-semibold mb-1">💡 Hướng dẫn sử dụng:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="space-y-1">
            <div>• <strong>Bold/Italic:</strong> Chọn text → nhấn B/I</div>
            <div>• <strong>Tiêu đề:</strong> Chọn text → nhấn H3/H4</div>
            <div>• <strong>Danh sách:</strong> Nhấn nút danh sách</div>
            <div>• <strong>Trích dẫn:</strong> Chọn text → nhấn quote</div>
          </div>
          <div className="space-y-1">
            <div>• <strong>Link:</strong> Chọn text → nhấn link</div>
            <div>• <strong>Clear:</strong> Xóa tất cả định dạng</div>
            <div>• <strong>Undo/Redo:</strong> Hoàn tác/làm lại</div>
            <div>• <strong>Enter:</strong> Tạo đoạn văn mới</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SimpleEditor;
