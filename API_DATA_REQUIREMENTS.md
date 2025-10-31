# API Data Requirements - Java Bronze Quiz Frontend

Tài liệu này mô tả chi tiết các API endpoints và cấu trúc dữ liệu mà frontend mong đợi từ backend.

## Mục lục

1. [Authentication APIs](#1-authentication-apis)
2. [Document APIs](#2-document-apis)
3. [Exam APIs](#3-exam-apis)
4. [Dashboard API](#4-dashboard-api)
5. [Profile API](#5-profile-api)
6. [Gamification APIs](#6-gamification-apis)
7. [Questions API](#7-questions-api)
8. [PWA & Analytics APIs](#8-pwa--analytics-apis)

---

## 1. Authentication APIs

### 1.1 Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "remember": boolean,
  "turnstile_token": "string (optional)"
}
```

**Response Success:**
```json
{
  "success": true,
  "data": {
    "access_token": "string",
    "user": {
      "id": 1,
      "name": "string",
      "email": "string",
      "role": "student|teacher|admin",
      "created_at": "datetime"
    }
  },
  "message": "Đăng nhập thành công"
}
```

### 1.2 Register

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "password_confirmation": "string",
  "turnstile_token": "string (optional)"
}
```

**Response - Internal Email (Auto Activated):**
```json
{
  "success": true,
  "is_internal":true,
  "data": {
    "access_token": "string",
    "user": {
      "id": 1,
      "name": "string",
      "email": "string",
      "role": "student",
      "created_at": "datetime"
    }
  },
  "message": "Đăng ký thành công"
}
```

**Response - External Email (Needs Approval):**
```json
{
  "success": true,
  "is_internal":false,
  "message": "Tài khoản của bạn đang chờ phê duyệt"
}
```

### 1.3 Get Current User

**Endpoint:** `GET /api/auth/me`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "string",
    "email": "string",
    "role": "student|teacher|admin",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}
```

### 1.4 Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "string"
  }
}
```

### 1.6 Get Auth Config

**Endpoint:** `GET /api/auth/config`

**Response:**
```json
{
  "success": true,
  "data": {
    "turnstile": {
      "enabled": boolean,
      "site_key": "string",
      "theme": "light|dark|auto"
    }
  }
}
```

### 1.7 Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

---

## 2. Document APIs

### 2.1 Get All Documents

**Endpoint:** `GET /api/documents`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "string",
      "slug": "string",
      "description": "string",
      "categories_count": 8,
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ]
}
```

### 2.2 Get Document by Slug

**Endpoint:** `GET /api/documents/{slug}`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "string",
    "slug": "string",
    "description": "string",
    "categories": [
      {
        "id": 1,
        "title": "string",
        "description": "string",
        "questions_count": 10,
        "progress": {
          "status": "in_progress|completed",
          "answered_count": 5,
          "correct_count": 4
        }
      }
    ],
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}
```

### 2.3 Get Categories of Document

**Endpoint:** `GET /api/documents/{slug}/categories`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "string",
      "description": "string",
      "questions_count": 10,
      "progress": {
        "status": "in_progress|completed",
        "answered_count": 5,
        "correct_count": 4
      }
    }
  ]
}
```

### 2.4 Get Document Progress

**Endpoint:** `GET /api/documents/{slug}/progress`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "document_id": 1,
    "completion_percentage": 65,
    "completed_categories": 5,
    "total_categories": 8,
    "average_score": 82
  }
}
```

### 2.5 Get Category by ID

**Endpoint:** `GET /api/documents/category/{categoryId}`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "string",
    "description": "string",
    "document": {
      "id": 1,
      "title": "string",
      "slug": "string"
    },
    "questions": [
      {
        "id": 1,
        "content": "string (HTML allowed)",
        "image_url": "string|null",
        "choices": [
          {
            "id": 1,
            "option_text": "string (HTML allowed)",
            "is_correct": boolean
          }
        ],
        "explanation": "string (HTML allowed)",
        "vietnamese_translation": "string|null"
      }
    ],
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}
```

### 2.6 Get Category Practice Data

**Endpoint:** `GET /api/documents/category/{categoryId}/practice?restart=1`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": 1,
      "title": "string",
      "description": "string",
      "document": {
        "id": 1,
        "title": "string",
        "slug": "string"
      }
    },
    "questions": [
      {
        "id": 1,
        "content": "string (HTML allowed)",
        "image_url": "string|null",
        "choices": [
          {
            "id": 1,
            "option_text": "string (HTML allowed)",
            "is_correct": boolean
          }
        ],
        "explanation": "string (HTML allowed)",
        "vietnamese_translation": "string|null"
      }
    ],
    "progress": {
      "id": 1,
      "category_id": 1,
      "status": "in_progress|completed",
      "answered_count": 5,
      "correct_count": 4,
      "last_accessed_at": "datetime"
    }
  }
}
```

### 2.7 Save Category Progress

**Endpoint:** `POST /api/documents/category/{categoryId}/progress`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "answered_count": 5,
  "correct_count": 4,
  "status": "in_progress|completed",
  "last_accessed_at": "datetime"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "category_id": 1,
    "status": "in_progress|completed",
    "answered_count": 5,
    "correct_count": 4,
    "updated_at": "datetime"
  }
}
```

### 2.8 Get Document History

**Endpoint:** `GET /api/documents/history`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "document": {
        "id": 1,
        "title": "string",
        "slug": "string"
      },
      "completion_percentage": 65,
      "last_accessed_at": "datetime",
      "status": "in_progress|completed"
    }
  ]
}
```

### 2.9 Get Document Progress Details

**Endpoint:** `GET /api/documents/progress/{progressId}`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "document": {
      "id": 1,
      "title": "string",
      "slug": "string"
    },
    "completion_percentage": 65,
    "completed_categories": 5,
    "total_categories": 8,
    "average_score": 82,
    "current_category": {
      "id": 1,
      "title": "string"
    },
    "categories": [
      {
        "id": 1,
        "title": "string",
        "status": "completed",
        "score": 80
      }
    ],
    "last_accessed_at": "datetime"
  }
}
```

### 2.10 Start Document (Create/Resume Progress)

**Endpoint:** `POST /api/documents/{slug}/start`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "progress": {
      "id": 1,
      "document_id": 1,
      "status": "in_progress",
      "completion_percentage": 0,
      "created_at": "datetime"
    }
  }
}
```

### 2.11 Restart Document

**Endpoint:** `POST /api/documents/{slug}/restart`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "progress": {
      "id": 2,
      "document_id": 1,
      "status": "in_progress",
      "completion_percentage": 0,
      "created_at": "datetime"
    }
  }
}
```

### 2.12 Complete Document

**Endpoint:** `POST /api/documents/{slug}/complete`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "completed",
    "completion_percentage": 100,
    "completed_categories": 8,
    "total_categories": 8,
    "average_score": 85,
    "completed_at": "datetime"
  },
  "message": "Document completed successfully"
}
```

---

## 3. Exam APIs

### 3.1 Get All Exams

**Endpoint:** `GET /api/exams`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "string",
      "slug": "string",
      "description": "string",
      "duration_minutes": 60,
      "passing_score": 70,
      "questions_count": 50,
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ]
}
```

### 3.2 Get Exam by Slug

**Endpoint:** `GET /api/exams/{slug}`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "string",
    "slug": "string",
    "description": "string",
    "duration_minutes": 60,
    "passing_score": 70,
    "questions_count": 50,
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}
```

### 3.3 Get Quiz Data (Exam + Questions)

**Endpoint:** `GET /api/exams/{slug}/quiz`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "exam": {
      "id": 1,
      "title": "string",
      "slug": "string",
      "duration_minutes": 60,
      "passing_score": 70
    },
    "questions": [
      {
        "id": 1,
        "content": "string (HTML allowed)",
        "image_url": "string|null",
        "choices": [
          {
            "id": 1,
            "option_text": "string (HTML allowed)",
            "is_correct": boolean
          }
        ],
        "explanation": "string (HTML allowed)",
        "vietnamese_translation": "string|null"
      }
    ]
  }
}
```

### 3.4 Start Exam (Create/Continue Attempt)

**Endpoint:** `POST /api/exams/{slug}/start`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "attempt": {
      "id": 1,
      "exam_id": 1,
      "status": "in_progress",
      "created_at": "datetime"
    }
  }
}
```

### 3.5 Get Exam History

**Endpoint:** `GET /api/exams/{slug}/history`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "exam": {
        "id": 1,
        "title": "string",
        "slug": "string"
      },
      "status": "completed|in_progress",
      "score_percentage": 85,
      "is_passed": true,
      "total_questions": 50,
      "answered_questions": 50,
      "correct_answers": 43,
      "started_at": "datetime",
      "submitted_at": "datetime"
    }
  ]
}
```

### 3.6 Get Attempt Details

**Endpoint:** `GET /api/exams/attempts/{attemptId}`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "attempt": {
    "id": 1,
    "exam": {
      "id": 1,
      "title": "string",
      "slug": "string"
    },
    "status": "completed",
    "score_percentage": 85,
    "is_passed": true,
    "total_questions": 50,
    "answered_questions": 50,
    "correct_answers": 43,
    "incorrect_answers": 7,
    "time_spent": "string",
    "started_at": "datetime",
    "submitted_at": "datetime",
    "answers": [
      {
        "id": 1,
        "question": {
          "id": 1,
          "content": "string (HTML allowed)",
          "image_url": "string|null",
          "choices": [
            {
              "id": 1,
              "option_text": "string (HTML allowed)",
              "is_correct": boolean
            }
          ],
          "explanation": "string (HTML allowed)",
          "vietnamese_translation": "string|null"
        },
        "selected_choice_ids": [1],
        "is_correct": true
      }
    ]
  }
}
```

### 3.7 Get Attempt Questions

**Endpoint:** `GET /api/exams/attempts/{attemptId}/questions`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "question": {
        "id": 1,
        "content": "string (HTML allowed)",
        "image_url": "string|null",
        "choices": [
          {
            "id": 1,
            "option_text": "string (HTML allowed)",
            "is_correct": boolean
          }
        ],
        "explanation": "string (HTML allowed)",
        "vietnamese_translation": "string|null"
      },
      "selected_choice_ids": [1, 2],
      "is_correct": true
    }
  ]
}
```

### 3.8 Submit Answer

**Endpoint:** `POST /api/exams/attempts/{attemptId}/answer`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "question_id": 1,
  "selected_choice_ids": [1, 2],
  "time_spent_seconds": 30,
  "is_flagged": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "question_id": 1,
    "selected_choice_ids": [1, 2],
    "is_correct": true
  }
}
```

### 3.9 Submit Exam

**Endpoint:** `POST /api/exams/attempts/{attemptId}/submit`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "completed",
    "score_percentage": 85,
    "is_passed": true,
    "total_questions": 50,
    "answered_questions": 50,
    "correct_answers": 43,
    "submitted_at": "datetime"
  },
  "message": "Bài thi đã được nộp thành công"
}
```

### 3.10 Complete Exam

**Endpoint:** `POST /api/exams/{slug}/complete`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "time_spent_seconds": 3600,
  "score": 43,
  "total_questions": 50,
  "answers": [
    {
      "question_id": 1,
      "selected_choice_ids": [1],
      "is_correct": true,
      "time_spent_seconds": 60
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attempt": {
      "id": 1,
      "exam_id": 1,
      "status": "completed",
      "score_percentage": 85,
      "is_passed": true,
      "total_questions": 50,
      "correct_answers": 43,
      "completed_at": "datetime"
    }
  },
  "message": "Exam completed successfully"
}
```

### 3.11 Restart Exam

**Endpoint:** `POST /api/exams/{slug}/restart`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "attempt": {
      "id": 2,
      "exam_id": 1,
      "status": "in_progress",
      "created_at": "datetime"
    }
  }
}
```

### 3.12 Complete Attempt

**Endpoint:** `POST /api/exams/attempts/{attemptId}/complete`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "time_spent_seconds": 3600
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attempt": {
      "id": 1,
      "exam": {
        "id": 1,
        "slug": "string"
      },
      "status": "completed",
      "score_percentage": 85,
      "is_passed": true,
      "completed_at": "datetime"
    }
  }
}
```

---

## 4. Dashboard API

### 4.1 Get Dashboard Data

**Endpoint:** `GET /api/dashboard`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "documents_in_progress": 3,
      "documents_completed": 2,
      "exams_in_progress": 1,
      "exams_passed": 5
    },
    "document_progresses": [
      {
        "id": 1,
        "document_title": "string",
        "document_slug": "string",
        "completion_percentage": 65,
        "completed_categories": 5,
        "total_categories": 8,
        "average_score": 82,
        "current_category": {
          "id": 1,
          "title": "string"
        },
        "status": "in_progress",
        "last_accessed_at": "datetime"
      }
    ],
    "exam_attempts": [
      {
        "id": 1,
        "exam_title": "string",
        "exam_slug": "string",
        "status": "completed|in_progress",
        "score_percentage": 85,
        "is_passed": true,
        "total_questions": 50,
        "answered_questions": 50,
        "correct_answers": 43,
        "last_accessed_at": "datetime"
      }
    ],
    "gamification": {
      "user_stats": {
        "level": 10,
        "total_points": 1500,
        "current_streak": 5,
        "longest_streak": 10
      },
      "level_progress": {
        "current_xp": 500,
        "xp_to_next_level": 1000,
        "progress_percentage": 50
      }
    }
  }
}
```

### 4.2 Get Quick Stats

**Endpoint:** `GET /api/dashboard/quick-stats`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "documents_in_progress": 3,
    "exams_in_progress": 1,
    "today_practices": 5,
    "current_streak": 5
  }
}
```

### 4.3 Clear Cache

**Endpoint:** `POST /api/dashboard/clear-cache`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared successfully"
}
```

---

## 5. Profile API

### 5.1 Get Profile

**Endpoint:** `GET /api/profile`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "stats": {
    "id": 1,
    "name": "string",
    "email": "string",
    "role": "student|teacher|admin",
    "status": "active|inactive",
    "joined_date": "datetime",
    "global_rank": 25,
    "level": 10,
    "experience": 5000,
    "experience_to_next_level": 10000,
    "level_progress": 50,
    "rank_tier": "novice|proficient|veteran|expert|master|legendary",
    "total_points": 1500,
    "lifetime_points": 2000,
    "quizzes_completed": 50,
    "perfect_scores": 15,
    "accuracy": 85.5,
    "total_correct_answers": 250,
    "total_questions_answered": 300,
    "current_streak": 5,
    "longest_streak": 10,
    "achievements_count": 20,
    "recent_achievements": [
      {
        "name": "string",
        "description": "string",
        "icon": "fas fa-trophy",
        "completed_at": "datetime"
      }
    ]
  }
}
```

### 5.2 Update Profile

**Endpoint:** `PUT /api/profile`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "name": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật thông tin thành công",
  "data": {
    "id": 1,
    "name": "string",
    "email": "string",
    "role": "student",
    "updated_at": "datetime"
  }
}
```

### 5.3 Update Password

**Endpoint:** `POST /api/profile/password`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "current_password": "string",
  "password": "string",
  "password_confirmation": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đổi mật khẩu thành công"
}
```

### 5.4 Get Statistics

**Endpoint:** `GET /api/profile/statistics`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "level": 10,
    "total_points": 1500,
    "quizzes_completed": 50,
    "accuracy": 85.5
  }
}
```

---

## 6. Gamification APIs

### 6.1 Get User Achievements

**Endpoint:** `GET /api/achievements/user?page=1&per_page=12`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "achievements": [
    {
      "id": 1,
      "name": "string",
      "description": "string",
      "icon": "fas fa-trophy",
      "tier": "bronze|silver|gold|platinum",
      "category": "string",
      "points": 100,
      "unlocked": boolean,
      "unlocked_at": "datetime|null",
      "progress": {
        "current": 5,
        "target": 10
      }
    }
  ],
  "stats": {
    "unlocked": 15,
    "locked": 5,
    "total_points": 1500,
    "completion_rate": 75
  },
  "has_more": boolean
}
```

### 6.2 Get Global Leaderboard

**Endpoint:** `GET /api/leaderboard/global?limit=50&period=month`

**Headers:** `Authorization: Bearer {access_token}`

**Query Parameters:**
- `limit`: Số lượng users (default: 50)
- `period`: `all|month|week` (default: `all`)

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "user": {
        "id": 1,
        "name": "string",
        "email": "string"
      },
      "total_points": 5000,
      "level": 25,
      "current_streak": 10
    }
  ],
  "user_rank": {
    "rank": 15,
    "total_points": 2000
  },
  "total_players": 100
}
```

### 6.3 Get Level Leaderboard

**Endpoint:** `GET /api/leaderboard/level?limit=50`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "user": {
        "id": 1,
        "name": "string",
        "email": "string"
      },
      "level": 30,
      "total_points": 5000
    }
  ],
  "user_rank": {
    "rank": 15,
    "level": 10
  }
}
```

### 6.4 Get Streak Leaderboard

**Endpoint:** `GET /api/leaderboard/streak?limit=50`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "user": {
        "id": 1,
        "name": "string",
        "email": "string"
      },
      "current_streak": 50,
      "longest_streak": 50
    }
  ],
  "user_rank": {
    "rank": 10,
    "current_streak": 15
  }
}
```

### 6.5 Get Accuracy Leaderboard

**Endpoint:** `GET /api/leaderboard/accuracy?limit=50`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "user": {
        "id": 1,
        "name": "string",
        "email": "string"
      },
      "accuracy": 98.5,
      "total_questions_answered": 1000,
      "correct_answers": 985
    }
  ],
  "user_rank": {
    "rank": 20,
    "accuracy": 85.5
  }
}
```

### 6.6 Get User Ranks

**Endpoint:** `GET /api/leaderboard/user-ranks`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "user_id": 1,
  "user_rank": {
    "rank": 15,
    "total_points": 2000,
    "level": 10,
    "current_streak": 5,
    "longest_streak": 10,
    "accuracy": 85.5
  }
}
```

### 6.7 Get Recently Completed Achievements

**Endpoint:** `GET /api/achievements/recent`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "string",
      "description": "string",
      "icon": "fas fa-trophy",
      "tier": "bronze|silver|gold|platinum",
      "category": "string",
      "points": 100,
      "unlocked_at": "datetime"
    }
  ]
}
```

### 6.8 Get All Achievements

**Endpoint:** `GET /api/achievements`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "string",
      "description": "string",
      "icon": "fas fa-trophy",
      "tier": "bronze|silver|gold|platinum",
      "category": "string",
      "points": 100
    }
  ]
}
```

### 6.9 Get Achievement Categories

**Endpoint:** `GET /api/achievements/categories`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "string",
      "description": "string",
      "icon": "fas fa-trophy",
      "achievements_count": 10
    }
  ]
}
```

### 6.10 Get Achievement by ID

**Endpoint:** `GET /api/achievements/{id}`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "string",
    "description": "string",
    "icon": "fas fa-trophy",
    "tier": "bronze|silver|gold|platinum",
    "category": "string",
    "points": 100,
    "criteria": "string"
  }
}
```

---

## 7. Questions API

### 7.1 Get All Questions

**Endpoint:** `GET /api/questions`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "content": "string (HTML allowed)",
      "image_url": "string|null",
      "choices": [
        {
          "id": 1,
          "option_text": "string (HTML allowed)",
          "is_correct": boolean
        }
      ],
      "explanation": "string (HTML allowed)",
      "vietnamese_translation": "string|null"
    }
  ]
}
```

### 7.2 Search Questions

**Endpoint:** `GET /api/questions/search?query=string`

**Headers:** `Authorization: Bearer {access_token}`

**Query Parameters:**
- `query`: Search keyword

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "content": "string (HTML allowed)",
      "choices_count": 4
    }
  ]
}
```

### 7.3 Get Questions by Exam

**Endpoint:** `GET /api/questions/exam/{examId}`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "content": "string (HTML allowed)",
      "image_url": "string|null",
      "choices": [
        {
          "id": 1,
          "option_text": "string (HTML allowed)",
          "is_correct": boolean
        }
      ],
      "explanation": "string (HTML allowed)",
      "vietnamese_translation": "string|null"
    }
  ]
}
```

### 7.4 Get Question by ID

**Endpoint:** `GET /api/questions/{id}`

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "content": "string (HTML allowed)",
    "image_url": "string|null",
    "choices": [
      {
        "id": 1,
        "option_text": "string (HTML allowed)",
        "is_correct": boolean
      }
    ],
    "explanation": "string (HTML allowed)",
    "vietnamese_translation": "string|null"
  }
}
```

---

## 8. PWA & Analytics APIs

### 8.1 Track PWA Analytics

**Endpoint:** `POST /api/analytics/pwa`

**Request Body:**
```json
{
  "event": "string",
  "data": {},
  "timestamp": number
}
```

**Response:**
```json
{
  "success": true
}
```

### 8.2 Track PWA Installation

**Endpoint:** `POST /api/analytics/pwa/installation`

**Request Body:**
```json
{
  "platform": "string",
  "device": "string"
}
```

**Response:**
```json
{
  "success": true
}
```

### 8.3 Track PWA Usage

**Endpoint:** `POST /api/analytics/pwa/usage`

**Request Body:**
```json
{
  "page": "string",
  "duration": number,
  "action": "string"
}
```

**Response:**
```json
{
  "success": true
}
```

### 8.4 Get PWA Analytics

**Endpoint:** `GET /api/analytics/pwa`

**Headers:** `Authorization: Bearer {access_token}` (for admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "total_installs": 100,
    "active_users": 50,
    "usage_stats": {}
  }
}
```

### 8.5 Security CSP Report

**Endpoint:** `POST /api/security/csp-report`

**Request Body:**
```json
{
  "document-uri": "string",
  "violated-directive": "string",
  "blocked-uri": "string"
}
```

**Response:**
```json
{
  "success": true
}
```

---

## Generic Response Format

### Success Response

Tất cả API thành công đều trả về format:
```json
{
  "success": true,
  "data": {},
  "message": "string (optional)"
}
```

### Error Response

Tất cả API lỗi đều trả về format:
```json
{
  "success": false,
  "message": "string",
  "errors": {
    "field_name": ["validation message 1", "validation message 2"]
  }
}
```

**HTTP Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors (more detailed)
- `500 Internal Server Error`: Server error

---

## Notes

1. Tất cả API đều yêu cầu JWT token (trừ login/register) trong header: `Authorization: Bearer {access_token}`

2. Datetime format: ISO 8601 hoặc format: `Y-m-d H:i:s`

3. HTML Content: Các field như `content`, `explanation`, `option_text` hỗ trợ HTML markup

4. Pagination: Các API list hỗ trợ pagination với query params `page` và `per_page`

5. Error Handling: Frontend sẽ tự động refresh token khi nhận 401, nếu refresh fail sẽ redirect về login

