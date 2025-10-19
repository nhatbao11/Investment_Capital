import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { file } = req.query
    
    if (!file) {
      return res.status(400).json({ error: 'File parameter required' })
    }
    
    const filePath = Array.isArray(file) ? file.join('/') : file
    
    // Construct the full file path
    const baseDir = process.env.NODE_ENV === 'production' ? '/root/investment_capital' : process.cwd()
    const fullPath = path.join(baseDir, 'backend', 'uploads', filePath)
    const uploadsDir = path.join(baseDir, 'backend', 'uploads')
    
    // Debug info
    const debugInfo = {
      requestedFile: filePath,
      baseDir,
      fullPath,
      uploadsDir,
      fileExists: fs.existsSync(fullPath),
      uploadsDirExists: fs.existsSync(uploadsDir),
      isWithinUploads: fullPath.startsWith(uploadsDir),
      nodeEnv: process.env.NODE_ENV,
      cwd: process.cwd()
    }
    
    // List files in uploads directory
    let uploadsFiles = []
    try {
      uploadsFiles = fs.readdirSync(uploadsDir, { recursive: true })
    } catch (e) {
      uploadsFiles = ['Error reading uploads directory']
    }
    
    res.json({
      success: true,
      debug: debugInfo,
      uploadsFiles: uploadsFiles.slice(0, 20) // Limit to first 20 files
    })
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Debug error', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}
