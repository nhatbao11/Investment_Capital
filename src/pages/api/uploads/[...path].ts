import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { path: filePathArray, track_id, track_type } = req.query
    
    if (!filePathArray || !Array.isArray(filePathArray)) {
      return res.status(400).json({ error: 'Invalid file path' })
    }
    
    const filePath = filePathArray.join('/')
    
    // Track view nếu có track_id và track_type (giống web)
    if (track_id && track_type && req.method === 'GET') {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        
        // Gọi đúng endpoint như web
        let endpoint = ''
        if (track_type === 'post') {
          endpoint = `${apiUrl}/api/v1/posts/${track_id}/view`
        } else if (track_type === 'investment_knowledge') {
          endpoint = `${apiUrl}/api/v1/investment-knowledge/${track_id}/view`
        } else if (track_type === 'bookjourney') {
          endpoint = `${apiUrl}/api/v1/bookjourney/${track_id}/view`
        }
        
        if (endpoint) {
          // Forward IP và User-Agent để track đúng
          const forwardedFor = req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''
          let ip = ''
          if (typeof forwardedFor === 'string') {
            ip = forwardedFor.split(',')[0].trim()
          } else if (Array.isArray(forwardedFor)) {
            ip = forwardedFor[0]
          } else {
            ip = String(forwardedFor)
          }
          const userAgent = req.headers['user-agent'] || ''
          
          await fetch(endpoint, { 
            method: 'POST',
            headers: {
              'X-Forwarded-For': ip,
              'User-Agent': userAgent,
              'Content-Type': 'application/json'
            }
          })
        }
      } catch (error) {
        console.error('Error tracking view:', error)
        // Không fail nếu track không được
      }
    }

    // Construct the full file path - support both local and VPS paths
    const baseDir = process.env.NODE_ENV === 'production' ? '/root/investment_capital' : process.cwd()
    const fullPath = path.join(baseDir, 'backend', 'uploads', filePath)
    
    // Security check - ensure the path is within uploads directory
    const uploadsDir = path.join(baseDir, 'backend', 'uploads')
    if (!fullPath.startsWith(uploadsDir)) {
      return res.status(403).json({ 
        error: 'Access denied',
        debug: {
          filePath,
          baseDir,
          fullPath,
          uploadsDir,
          isWithinUploads: fullPath.startsWith(uploadsDir)
        }
      })
    }

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      // Debug: list some files in the directory
      let debugInfo: any = {
        filePath,
        fullPath,
        uploadsDir,
        uploadsDirExists: fs.existsSync(uploadsDir),
        nodeEnv: process.env.NODE_ENV
      }
      
      try {
        const parentDir = path.dirname(fullPath)
        debugInfo.parentDirExists = fs.existsSync(parentDir)
        if (fs.existsSync(parentDir)) {
          debugInfo.parentDirFiles = fs.readdirSync(parentDir)
        }
      } catch (e) {
        debugInfo.parentDirError = e instanceof Error ? e.message : 'Unknown error'
      }
      
      return res.status(404).json({ 
        error: 'File not found',
        debug: debugInfo
      })
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
    res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' })
  }
}
