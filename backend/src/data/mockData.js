// Mock data for testing when database is not available

const mockFeedbacks = [
  {
    id: 1,
    content: "Dịch vụ tư vấn đầu tư rất chuyên nghiệp, giúp tôi hiểu rõ hơn về thị trường.",
    rating: 5,
    user_name: "Nguyễn Văn A",
    user_email: "nguyenvana@email.com",
    company: "Công ty ABC",
    status: "approved",
    created_at: "2024-01-15T10:30:00.000Z"
  },
  {
    id: 2,
    content: "Phân tích ngành rất chi tiết và chính xác. Tôi đã áp dụng và có kết quả tốt.",
    rating: 4,
    user_name: "Trần Thị B",
    user_email: "tranthib@email.com",
    company: "Công ty XYZ",
    status: "approved",
    created_at: "2024-01-14T14:20:00.000Z"
  },
  {
    id: 3,
    content: "Đội ngũ chuyên gia có kinh nghiệm, tư vấn nhiệt tình và tận tâm.",
    rating: 5,
    user_name: "Lê Văn C",
    user_email: "levanc@email.com",
    company: "Công ty DEF",
    status: "approved",
    created_at: "2024-01-13T09:15:00.000Z"
  }
];

const mockPosts = [
  {
    id: 1,
    title: "Phân tích ngành ngân hàng Việt Nam 2024",
    content: "Ngành ngân hàng Việt Nam đang trải qua giai đoạn chuyển đổi số mạnh mẽ...",
    category: "nganh",
    thumbnail_url: "/images/phantichnganh.png",
    status: "published",
    view_count: 1250,
    author: "Chuyên gia tài chính",
    created_at: "2024-01-15T10:30:00.000Z"
  },
  {
    id: 2,
    title: "Báo cáo phân tích Công ty Cổ phần FPT",
    content: "FPT là một trong những công ty công nghệ hàng đầu Việt Nam...",
    category: "doanh_nghiep",
    thumbnail_url: "/images/phantichdoanhnghiep.jpg",
    status: "published",
    view_count: 890,
    author: "Chuyên gia phân tích",
    created_at: "2024-01-14T14:20:00.000Z"
  },
  {
    id: 3,
    title: "Triển vọng ngành bất động sản 2024",
    content: "Thị trường bất động sản Việt Nam đang có những tín hiệu tích cực...",
    category: "nganh",
    thumbnail_url: "/images/phantichnganh.png",
    status: "published",
    view_count: 2100,
    author: "Chuyên gia bất động sản",
    created_at: "2024-01-13T09:15:00.000Z"
  }
];

const mockUsers = [
  {
    id: 1,
    full_name: "Admin User",
    email: "admin@ytcapital.com",
    role: "admin",
    is_active: 1,
    created_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    full_name: "Test User",
    email: "test@test.com",
    role: "client",
    is_active: 1,
    created_at: "2024-01-10T10:00:00.000Z"
  }
];

module.exports = {
  mockFeedbacks,
  mockPosts,
  mockUsers
};



















