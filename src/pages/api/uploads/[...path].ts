import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { path: filePathArray } = req.query
    
    if (!filePathArray || !Array.isArray(filePathArray)) {
      return res.status(400).json({ error: 'Invalid file path' })
    }
    
    const filePath = filePathArray.join('/')

    // Construct the full file path - support both local and VPS paths
    const baseDir = process.env.NODE_ENV === 'production' ? '/root/investment_capital' : process.cwd()
    const fullPath = path.join(baseDir, 'backend', 'uploads', filePath)
    
    // Security check - ensure the path is within uploads directory
    const uploadsDir = path.join(baseDir, 'backend', 'uploads')
    if (!fullPath.startsWith(uploadsDir)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    // Get file stats
    const stats = fs.statSync(fullPath)
    
    // Determine content type based on file extension
    const ext = path.extname(fullPath).toLowerCase()
    let contentType = 'application/octet-stream'
    
    if (ext === '.pdf') {
      contentType = 'application/pdf'
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg'
    } else if (ext === '.png') {
      contentType = 'image/png'
    } else if (ext === '.gif') {
      contentType = 'image/gif'
    } else if (ext === '.webp') {
      contentType = 'image/webp'
    }
    
    // Set appropriate headers
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Length', stats.size)
    res.setHeader('Cache-Control', 'public, max-age=31536000')
    
    // Stream the file
    const fileStream = fs.createReadStream(fullPath)
    fileStream.pipe(res)
    
  } catch (error) {
    console.error('Error serving file:', error)
    res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}
