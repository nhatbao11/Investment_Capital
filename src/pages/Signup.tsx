import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/YT LOGO.png";

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="flex items-center space-x-3 mb-8">
        <img src={Logo} alt="Y&T Capital Logo" className="h-[50px]" />
        <h1 className="text-2xl font-bold text-blue-300">Y&T Capital</h1>
      </div>

      <div className="w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-blue-300 mb-6 text-center">Đăng ký</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200">
              Họ và tên
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nhập họ và tên"
              autoComplete="name"
              className="w-full p-3 bg-gray-700 rounded-lg text-white border-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Nhập email"
              autoComplete="email"
              className="w-full p-3 bg-gray-700 rounded-lg text-white border-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu"
              autoComplete="new-password"
              className="w-full p-3 bg-gray-700 rounded-lg text-white border-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-200">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="Xác nhận mật khẩu"
              autoComplete="new-password"
              className="w-full p-3 bg-gray-700 rounded-lg text-white border-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Đăng ký
          </button>
        </form>
        <p className="text-center text-sm text-gray-300 mt-4">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;