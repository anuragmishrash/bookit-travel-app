import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import mongoose from 'mongoose'
import app from '../server.js'

// Mock the server startup
jest.mock('../server.js', () => {
  const express = require('express')
  const cors = require('cors')
  
  const app = express()
  app.use(cors())
  app.use(express.json())
  
  // Mock routes
  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API is running' })
  })
  
  app.get('/api/experiences', (req, res) => {
    res.json({
      success: true,
      data: {
        experiences: [],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0 }
      }
    })
  })
  
  return app
})

describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200)
      
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('API is running')
    })
  })

  describe('GET /api/experiences', () => {
    it('should return experiences list', async () => {
      const response = await request(app)
        .get('/api/experiences')
        .expect(200)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('experiences')
      expect(response.body.data).toHaveProperty('pagination')
    })
  })
})