"use client"

import React, { useEffect, useState } from 'react'
import NextLayout from '@/components/Layout/NextLayout'
import { useAuth } from '@/services/hooks/useAuth'
import { authApi } from '@/services/api/auth'
import { API_CONFIG } from '@/services/api/config'

export default function ProfilePage() {
  const { user, loading, updateProfile, changePassword, logout } = useAuth()
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [busy, setBusy] = useState(false)
  const [avatarVersion, setAvatarVersion] = useState(0)

  useEffect(() => {
    if (user) {
      setFullName(user.full_name)
      // @ts-ignore allow extra field
      setAvatarUrl((user as any).avatar_url || '')
    }
  }, [user])

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile)
      setAvatarPreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setAvatarPreview('')
    }
  }, [avatarFile])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setBusy(true)
      // Upload avatar if selected
      if (avatarFile) {
        const res = await authApi.uploadAvatar(avatarFile)
        setAvatarUrl(res.avatar_url)
        setAvatarVersion((v) => v + 1)
        await updateProfile({ full_name: fullName, avatar_url: res.avatar_url } as any)
      } else {
        await updateProfile({ full_name: fullName, ...(avatarUrl ? { avatar_url: avatarUrl } as any : {}) })
      }
      alert('Cập nhật hồ sơ thành công')
    } catch (err: any) {
      console.error(err)
      alert('Cập nhật hồ sơ thất bại')
    } finally {
      setBusy(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwd.next !== pwd.confirm) {
      alert('Mật khẩu xác nhận không khớp')
      return
    }
    try {
      setBusy(true)
      await changePassword({ current_password: pwd.current, new_password: pwd.next, confirm_password: pwd.confirm })
      setPwd({ current: '', next: '', confirm: '' })
      alert('Đổi mật khẩu thành công')
    } catch (err) {
      console.error(err)
      // Show specific error messages from API if available
      const message = (err as any)?.response?.data?.message || 'Đổi mật khẩu thất bại'
      alert(message)
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      if (!confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) return
      // Reuse admin delete if needed or implement /auth/profile DELETE later; temporary redirect to support flow
      // For now, inform user to liên hệ admin nếu chưa bật endpoint delete self
      alert('Tài khoản sẽ được xóa bởi admin. Vui lòng liên hệ nếu cần gấp.')
    } catch (err) {
      console.error(err)
      alert('Xóa tài khoản thất bại')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Đang tải...</div>
    )
  }
  if (!user) {
    if (typeof window !== 'undefined') window.location.href = '/login/'
    return null
  }

  const apiOrigin = (() => {
    try { return new URL(API_CONFIG.BASE_URL).origin } catch { return 'http://localhost:5000/api/v1' }
  })()
  const displayAvatar = (() => {
    const url = (avatarPreview || avatarUrl || '/images/Logo01.jpg')
    if (!url) return '/images/Logo01.jpg'
    if (url.startsWith('http')) return url
    if (url.startsWith('/uploads/')) return `${apiOrigin}${url}${avatarVersion ? `?v=${avatarVersion}` : ''}`
    return url
  })()

  return (
    <NextLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold mb-4">Hồ sơ cá nhân</h1>

        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Ảnh đại diện</label>
                <label className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 text-sm">
                  Chọn ảnh
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG/JPG/WebP, tối đa 5MB</p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Họ tên</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button type="submit" disabled={busy} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <h2 className="text-base font-semibold mb-3">Đổi mật khẩu</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Mật khẩu hiện tại</label>
              <input type="password" className="w-full border rounded px-3 py-2" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Mật khẩu mới</label>
              <input type="password" className="w-full border rounded px-3 py-2" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
              <input type="password" className="w-full border rounded px-3 py-2" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} required />
            </div>
            <div className="flex justify-end gap-3">
              <button type="submit" disabled={busy} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm">Đổi mật khẩu</button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-base font-semibold mb-3">Xóa tài khoản</h2>
          <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Xóa tài khoản</button>
        </div>
      </div>
    </NextLayout>
  )
}

