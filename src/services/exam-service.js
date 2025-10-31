/**
 * Exam Service
 * Handles all exam-related API calls
 */
import { http } from '@/api/http-client.js'

export const ExamService = {
  /**
   * Lấy tất cả exams
   */
  async get_all() {
    const { data } = await http.get('/api/exams')
    return data
  },

  /**
   * Lấy exam theo slug
   */
  async get_by_slug(slug) {
    const { data } = await http.get(`/api/exams/${slug}`)
    return data
  },

  /**
   * Bắt đầu exam (tạo attempt mới hoặc tiếp tục)
   */
  async start(slug) {
    const { data } = await http.post(`/api/exams/${slug}/start`)
    return data
  },

  /**
   * Lấy lịch sử attempts của exam
   */
  async get_history(slug) {
    const { data } = await http.get(`/api/exams/${slug}/history`)
    return data
  },

  /**
   * Lấy chi tiết một attempt
   */
  async get_attempt_details(attempt_id) {
    const { data } = await http.get(`/api/exams/attempts/${attempt_id}`)
    return data
  },

  /**
   * Lấy questions của attempt
   */
  async get_questions(attempt_id) {
    const { data } = await http.get(`/api/exams/attempts/${attempt_id}/questions`)
    return data
  },

  /**
   * Submit answer cho một câu hỏi
   */
  async submit_answer(attempt_id, question_id, choice_id) {
    const { data } = await http.post(`/api/exams/attempts/${attempt_id}/answer`, {
      question_id,
      choice_id,
    })
    return data
  },

  /**
   * Submit toàn bộ exam
   */
  async submit(attempt_id) {
    const { data } = await http.post(`/api/exams/attempts/${attempt_id}/submit`)
    return data
  },
}

