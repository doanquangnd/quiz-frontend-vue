/**
 * Document Service
 * Handles all document-related API calls
 */
import { http } from '@/api/http-client.js'

export const DocumentService = {
  /**
   * Lấy tất cả documents
   */
  async get_all() {
    const { data } = await http.get('/api/documents')
    return data
  },

  /**
   * Lấy document theo slug
   */
  async get_by_slug(slug) {
    const { data } = await http.get(`/api/documents/${slug}`)
    return data
  },

  /**
   * Lấy categories của document
   */
  async get_categories(slug) {
    const { data } = await http.get(`/api/documents/${slug}/categories`)
    return data
  },

  /**
   * Lấy progress của document
   */
  async get_progress(slug) {
    const { data } = await http.get(`/api/documents/${slug}/progress`)
    return data
  },

  /**
   * Lưu category progress
   */
  async save_category_progress(category_id, progress_data) {
    const { data } = await http.post(`/api/documents/category/${category_id}/progress`, progress_data)
    return data
  },

  /**
   * Lấy lịch sử học tập
   */
  async get_history() {
    const { data } = await http.get('/api/documents/history')
    return data
  },
}

