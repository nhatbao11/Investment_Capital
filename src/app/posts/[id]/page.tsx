"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { postsApi } from '@/services/api/posts'
import NextLayout from '@/components/Layout/NextLayout'

export default function PostDetailPage() {
  const params = useParams() as { id: string }
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const p = await postsApi.getPostById(Number(params.id))
        setPost(p)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  if (loading) return <div className="max-w-4xl mx-auto p-6">Đang tải...</div>
  if (!post) return <div className="max-w-4xl mx-auto p-6">Không tìm thấy bài viết</div>

  return (
    <NextLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-500 text-sm mb-6">{new Date(post.created_at).toLocaleDateString('vi-VN')}</div>
        {post.thumbnail_url && (
          <img src={post.thumbnail_url.startsWith('/uploads/') ? (process as any).env.NEXT_PUBLIC_API_URL?.replace('/api/v1','') + post.thumbnail_url : post.thumbnail_url} alt={post.title} className="w-full rounded-xl mb-6" />
        )}
        <div className="prose max-w-none whitespace-pre-wrap">{post.content}</div>
      </div>
    </NextLayout>
  )
}

