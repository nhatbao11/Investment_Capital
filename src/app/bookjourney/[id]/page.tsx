'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '../../../components/ui/Card';
import Heading from '../../../components/ui/Heading';
import Text from '../../../components/ui/Text';
import Button from '../../../components/ui/Button';
import Container from '../../../components/ui/Container';
import { resolveFileUrl, resolvePdfUrl } from '../../../utils/apiConfig';

interface BookJourney {
  id: number;
  title: string;
  description: string;
  image_url: string;
  pdf_url: string;
  view_count: number;
  download_count: number;
  created_at: string;
  author_name: string;
}

const BookJourneyDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<BookJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (params?.id) {
      fetchBook();
    }
  }, [params?.id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/bookjourney/${params?.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Không tìm thấy sách');
        }
        throw new Error('Lỗi khi tải thông tin sách');
      }

      const data = await response.json();
      setBook(data.data);
    } catch (err) {
      console.error('Error fetching book:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!book) return;

    try {
      setPdfLoading(true);
      
      // Tăng download count
      await fetch(`/api/v1/bookjourney/${book.id}/download`, {
        method: 'GET'
      });
      
      // Xử lý PDF URL
        const pdfUrl = resolvePdfUrl(book.pdf_url);
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error downloading book:', error);
      // Vẫn mở PDF ngay cả khi không tăng được count
        const pdfUrl = resolvePdfUrl(book.pdf_url);
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setPdfLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container className="py-12">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <Text className="text-gray-600">Đang tải thông tin sách...</Text>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-12">
        <Card className="p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 text-red-500 mx-auto mb-4 text-6xl">⚠️</div>
          <Heading level={2} className="text-red-600 mb-4">
            {error}
          </Heading>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={fetchBook}
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              🔄 Thử lại
            </Button>
            <Button
              onClick={() => router.back()}
              variant="outline"
            >
              ← Quay lại
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container className="py-12">
        <Card className="p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 text-gray-400 mx-auto mb-4 text-6xl">📚</div>
          <Heading level={2} className="text-gray-600 mb-4">
            Không tìm thấy sách
          </Heading>
          <Button
            onClick={() => router.back()}
            variant="outline"
          >
            ← Quay lại
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-6"
        >
          ← Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Info */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              {/* Book Cover */}
              <div className="mb-6">
                {book.image_url ? (
                  <img
                    src={book.image_url}
                    alt={book.title}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <div className="text-8xl text-gray-400">📚</div>
                  </div>
                )}
              </div>

              {/* Book Details */}
              <div className="space-y-4">
                <Heading level={2} className="text-xl">
                  {book.title}
                </Heading>

                {book.description && (
                  <Text className="text-gray-600">
                    {book.description}
                  </Text>
                )}

                {/* Stats */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Lượt xem:</span>
                    <span className="font-semibold">{book.view_count}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Lượt tải:</span>
                    <span className="font-semibold">{book.download_count}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Ngày đăng:</span>
                    <span className="font-semibold">{formatDate(book.created_at)}</span>
                  </div>
                  {book.author_name && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Tác giả:</span>
                      <span className="font-semibold">{book.author_name}</span>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <Button
                  onClick={handleDownload}
                  disabled={pdfLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {pdfLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      📥 Tải xuống PDF
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* PDF Viewer */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Heading level={3}>Xem trước PDF</Heading>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                >
                  🔗 Mở trong tab mới
                </Button>
              </div>

              {/* PDF Embed */}
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={`${book.pdf_url.startsWith('/uploads/') ? `/api${book.pdf_url}` : book.pdf_url}#toolbar=1&navpanes=1&scrollbar=1`}
                  className="w-full h-96 lg:h-[600px]"
                  title={book.title}
                  onLoad={() => setPdfLoading(false)}
                />
              </div>

              {/* Fallback if PDF doesn't load */}
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <div className="text-yellow-600 mr-2 mt-0.5 text-lg">ℹ️</div>
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Không thể hiển thị PDF?</p>
                    <p>
                      Nếu PDF không hiển thị, bạn có thể{' '}
                      <button
                        onClick={handleDownload}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        tải xuống
                      </button>{' '}
                      để xem trên thiết bị của mình.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BookJourneyDetail;
