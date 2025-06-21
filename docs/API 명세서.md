# **AI 기반 무역 규제 레이더 플랫폼 API 명세서**

## **1. 개요 (Overview)**

본 문서는 'AI 기반 무역 규제 레이더 플랫폼'의 RESTful API를 상세히 기술한 통합 명세서입니다. 이 플랫폼은 복잡한 무역 규제, HS Code 분류, 수출입 요건, 화물 추적 등 무역 업무에 필수적인 정보들을 AI를 통해 분석하고 사용자에게 실시간으로 제공하는 것을 목표로 합니다.

문서는 개발자, 기획자 등 프로젝트 관련자들이 API의 기능, 요청/응답 형식, 비즈니스 로직 및 전체 시스템 흐름을 명확하게 이해할 수 있도록 작성되었습니다. 각 API는 요구사항 정의서에 명시된 유스케이스(UC) 및 기능 요구사항(FR)과 매핑되어 있습니다.

### **1.1 시스템 아키텍처 및 데이터 흐름**

플랫폼은 사용자의 자연어 질의를 AI가 분석하여 의도를 파악하고, 의도에 따라 관세청 API, UN Comtrade 등 외부 데이터 소스와 내부 데이터베이스를 활용해 최적의 정보를 생성 및 제공합니다. 사용자는 북마크 기능을 통해 관심 항목을 등록할 수 있으며, 시스템은 등록된 항목의 변동사항을 주기적으로 모니터링하여 사용자에게 푸시 및 이메일로 알림을 보냅니다.

- **주요 액터** : 비회원, 회원, 시스템
- **핵심 데이터 흐름은 아래와 같습니다.**
    1. **사용자 질의** -> **AI 의도 분석 (Intent Analysis)**
    2. **의도에 따른 정보 분석 (HS Code, 화물, 일반 정보)** -> **외부 API 및 DB 조회**
    3. **결과 생성 및 스트리밍 제공**
    4. **사용자 북마크** -> **시스템 모니터링** -> **변동 감지** -> **알림 발송**

### **1.2 기본 URL**

`http://localhost:8080/api`

### **1.3 공통 응답 형식 (Common Response Wrapper)**

모든 API 응답은 아래와 같은 `ApiResponse` 객체로 래핑되어 반환됩니다. 이를 통해 클라이언트는 일관된 방식으로 성공 및 오류 응답을 처리할 수 있습니다.

- **success** : `SUCCESS` 또는 `ERROR`
- **message** : 처리 결과에 대한 설명 메시지
- **data** : 실제 응답 데이터. **오류 발생 시에는 항상 `null` 입니다.**

### **성공 응답 예시 (`SUCCESS`)**

```json
{
  "success": "SUCCESS",
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동"
  }
}

```

### **오류 응답 예시 (`ERROR`)**

```json
{
  "success": "ERROR",
  "message": "해당 사용자를 찾을 수 없습니다.",
  "data": null
}

```

## **2. 인증 API (Auth)**

사용자 계정 생성, 로그인/로그아웃, 토큰 관리 등 인증과 관련된 기능을 제공합니다.

### **2.1 회원가입**

`POST /api/auth/register`

- **설명** : 이메일, 비밀번호, 이름 등 사용자 정보를 받아 신규 계정을 생성합니다. (관련 유스케이스 : `UC_001`, 관련 기능 요구사항 : `FR-AD-001`)
- **Request Body**
    
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "name": "홍길동"
    }
    
    ```
    
- **Response (200 OK)**
    
    ```json
    {
      "success": "SUCCESS",
      "message": "회원가입이 완료되었습니다",
      "data": {
        "id": 1,
        "email": "user@example.com",
        "name": "홍길동",
        "registrationType": "SELF"
      }
    }
    
    ```
    
- **Errors** : `USER_001` (이메일 중복), `USER_002` (유효하지 않은 이메일)

### **2.2 로그인**

`POST /api/auth/login`

- **설명** : 이메일과 비밀번호로 사용자를 인증하고, 서비스 접근에 필요한 Access Token과 Refresh Token을 발급합니다. (관련 유스케이스 : `UC_002`, 관련 기능 요구사항 : `FR-AD-001`)
- **Request Body**
    
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    
    ```
    
- **Response (200 OK)**
    
    ```json
    {
      "success": "SUCCESS",
      "message": "로그인 성공",
      "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "refresh_token_here",
        "tokenType": "Bearer",
        "expiresIn": 3600,
        "user": {
          "id": 1,
          "email": "user@example.com",
          "name": "홍길동"
        }
      }
    }
    
    ```
    
- **Errors** : `AUTH_001` (잘못된 인증정보)

### **2.3 토큰 갱신**

`POST /api/auth/refresh`

- **설명** : 만료된 Access Token을 Refresh Token을 이용해 재발급 받습니다.
- **Request Body**
    
    ```json
    {
      "refreshToken": "refresh_token_here"
    }
    
    ```
    
- **Response (200 OK)**
    
    ```json
    {
      "success": "SUCCESS",
      "message": "토큰이 갱신되었습니다",
      "data": {
        "accessToken": "new_access_token",
        "expiresIn": 3600
      }
    }
    
    ```
    
- **Errors** : `AUTH_003` (토큰 만료), `AUTH_004` (유효하지 않은 토큰)

### **2.4 SNS 로그인 URL 생성**

`GET /api/auth/sns/{provider}/url`

- **설명** : 지정된 SNS 프로바이더(예: google, kakao)의 OAuth 인증 페이지 URL을 생성하여 반환합니다. (관련 유스케이스 : `TG_UC_003`, 관련 기능 요구사항 : `FR-AD-002`)
- **Path Parameters**
    - `provider` (string, required) : SNS 프로바이더 (e.g., `google`)
- **Response (200 OK)**
    
    ```json
    {
      "success": "SUCCESS",
      "message": "SNS 로그인 URL 생성",
      "data": {
        "authUrl": "https://accounts.google.com/oauth/authorize?..."
      }
    }
    
    ```
    

### **2.5 SNS 로그인 콜백**

`POST /api/auth/sns/{provider}/callback`

- **설명** : SNS 인증 후 리디렉션되는 콜백을 처리합니다. 전달받은 인증 코드로 사용자 정보를 조회하여 로그인 또는 신규가입을 진행하고, 서비스 토큰을 발급합니다. (관련 유스케이스 : `TG_UC_003`)
- **Path Parameters**
    - `provider` (string, required) : SNS 프로바이더 (e.g., `google`)
- **Request Body**
    
    ```json
    {
      "code": "authorization_code",
      "state": "state_value"
    }
    
    ```
    
- **Response (200 OK)** : 로그인(2.2) 응답과 동일합니다.

### **2.6 로그아웃**

`POST /api/auth/logout`

- **설명** : 사용자의 세션을 만료시키고 Refresh Token을 비활성화합니다. (관련 기능 요구사항 : `FR-AD-001`)
- **Authorization** : `Bearer {accessToken}`
- **Response (200 OK)**
    
    ```json
    {
      "success": "SUCCESS",
      "message": "로그아웃되었습니다",
      "data": null
    }
    
    ```
    

## **3. 검색/분석 API (Search)**

플랫폼의 핵심 기능으로, AI 기반의 지능형 검색, HS Code 분석, 화물 추적 등 다양한 분석 기능을 제공합니다.

### **3.1 지능형 통합 검색 (의도 분석)**

`POST /api/search/analyze`

- **설명** : 사용자의 자연어 질의를 AI가 분석하여 'HS_CODE_ANALYSIS', 'CARGO_TRACKING', 'GENERAL_TRADE_INQUIRY' 중 하나의 의도를 파악하고, 다음 단계에 필요한 정보를 함께 반환합니다. (관련 유스케이스 : `TG_UC_006`, 관련 기능 요구사항 : `FR-AD-003`)
- **Authorization** : `Bearer {accessToken}`
- **Request Body**
    
    ```json
    {
      "query": "사용자 검색어"
    }
    
    ```
    

### **의도 분석 예시 (HS Code 분석)**

- **Request**
    
    ```json
    {
      "query": "아이폰 15 수출하려면?"
    }
    
    ```
    
- **Response (200 OK)**
    
    ```json
    {
      "success": "SUCCESS",
      "message": "검색 의도 분석 완료",
      "data": {
        "intent": "HS_CODE_ANALYSIS",
        "confidence": 0.95,
        "suggestedAction": "HS_CODE_ANALYSIS",
        "extractedKeywords": ["아이폰", "15", "수출"],
        "nextStepUrl": "/api/search/hscode/start"
      }
    }
    
    ```
    

### **의도 분석 예시 (화물 추적)**

- **설명** : 사용자가 화물관리번호를 입력했을 때의 시나리오입니다. 시스템은 번호 형식을 인지하고 화물 추적 의도로 판단합니다.
- **Request**
    
    ```json
    {
      "query": "12345678901234567 조회"
    }
    
    ```
    
- **Response (200 OK)**
    
    ```json
    {
      "success": "SUCCESS",
      "message": "검색 의도 분석 완료",
      "data": {
        "intent": "CARGO_TRACKING",
        "confidence": 0.99,
        "suggestedAction": "CARGO_TRACKING",
        "extractedKeywords": ["12345678901234567"],
        "nextStepUrl": "/api/search/cargo/12345678901234567"
      }
    }
    
    ```
    

### **의도 분석 예시 (일반 무역 정보 조회)**

- **Request**
    
    ```json
    {
      "query": "최근 미국의 관세 정책에 대해서 알려줘"
    }
    
    ```
    
- **Response (200 OK)**
    
    ```json
    {
      "success": "SUCCESS",
      "message": "검색 의도 분석 완료",
      "data": {
        "intent": "GENERAL_TRADE_INQUIRY",
        "confidence": 0.92,
        "suggestedAction": "GENERAL_TRADE_INQUIRY",
        "extractedKeywords": ["미국", "관세 정책", "최근"],
        "nextStepUrl": "/api/search/general/start"
      }
    }
    
    ```
    
- **Errors** : `SEARCH_001` (검색어 비어있음)

### **3.2 HS Code 분석 시작 (Think 단계)**

`POST /api/search/hscode/start`

- **설명** : HS Code 분석을 위한 비동기 작업을 시작합니다. 시스템은 분석에 필요한 정보를 수집하고 처리하는 'Thinking' 상태에 들어가며, 클라이언트에게는 작업 ID와 실시간 스트리밍 URL을 즉시 반환합니다. (관련 유스케이스 : `UC_007`, 관련 기능 요구사항 : `FR-AD-004`, `FR-AD-005`)
- **Authorization** : `Bearer {accessToken}`
- **Request Body**
    
    ```json
    {
      "query": "아이폰 15",
      "additionalInfo": {
        "purpose": "수출",
        "targetCountry": "미국"
      }
    }
    
    ```
    
- **Response (202 Accepted)**
    
    ```json
    {
      "success": "SUCCESS",
      "message": "HS Code 분석을 시작합니다",
      "data": {
        "jobId": "job_123456789",
        "status": "THINKING",
        "estimatedTime": 30,
        "streamUrl": "/api/search/hscode/stream/job_123456789"
      }
    }
    
    ```
    

### **3.3 HS Code 분석 스트리밍 (SSE)**

`GET /api/search/hscode/stream/{jobId}`

- **설명** : Server-Sent Events(SSE) 프로토콜을 사용하여 HS Code 분석 과정을 실시간으로 스트리밍합니다. 클라이언트는 이 API에 접속하여 분석 과정 및 최종 결과를 단계적으로 수신할 수 있습니다.
- **Authorization** : `Bearer {accessToken}`
- **Produces** : `text/event-stream`
- **Path Parameters**
    - `jobId` (string, required) : 분석 작업 ID
- **SSE Event Stream**
    - `event: thinking` : AI가 정보를 수집하고 생각하는 단계임을 알립니다.
    - `event: stream_start` : 본격적인 결과 텍스트 생성이 시작됨을 알립니다.
    - `event: stream_data` : 생성되는 텍스트 조각을 전송합니다.
    - `event: stream_end` : 스트리밍이 종료되고, 최종 분석 데이터가 JSON 형태로 전송됩니다.
    
    ```json
    event: thinking
    data: {"message": "HS Code 데이터베이스 검색 중..."}
    
    event: stream_start
    data: {"message": "분석 결과를 생성하고 있습니다"}
    
    event: stream_data
    data: {"content": "이"}
    
    event: stream_data
    data: {"content": " HS"}
    
    ...
    
    event: stream_end
    data: {
      "finalData": {
        "hsCode": "8517.12.00",
        "description": "스마트폰",
        "analysis": {
          "summary": "아이폰 15는 HS Code 8517.12.00으로 분류됩니다...",
          "exportRequirements": [...],
          "certifications": [...],
          "tariffRates": {...},
          "relatedNews": [...],
          "tradeStatistics": {...}
        },
        "sources": [
          {"title": "관세청 품목분류", "url": "https://...", "snippet": "핵심 근거 문단"}
        ]
      }
    }
    
    ```
    
- **Errors** : `SEARCH_002` (분석 작업 찾을 수 없음), `SEARCH_003` (분석 작업 실패)

### **3.4 화물 추적 조회**

`GET /api/search/cargo/{cargoNumber}`

- **설명** : 화물관리번호를 이용해 관세청 API로부터 해당 화물의 통관 진행 상태를 조회합니다. (관련 유스케이스 : `UC_008`, 관련 기능 요구사항 : `FR-AD-007`)
- **Authorization** : `Bearer {accessToken}`
- **Path Parameters**
    - `cargoNumber` (string, required) : 17자리 화물관리번호
- **Response (200 OK)**
    
    ```json
    {
      "success": "SUCCESS",
      "message": "화물 정보 조회 완료",
      "data": {
        "cargoNumber": "12345678901234567",
        "status": "통관 진행중",
        "currentStep": "검사 대기",
        "steps": [
          {
            "step": "신고 접수",
            "status": "완료",
            "timestamp": "2024-01-15T09:00:00Z"
          },
          {
            "step": "검사 대기",
            "status": "진행중",
            "timestamp": "2024-01-15T10:30:00Z"
          }
        ],
        "estimatedCompletion": "2024-01-16T14:00:00Z"
      }
    }
    
    ```
    
- **Errors** : `SEARCH_004` (화물번호 유효하지 않음)

### **3.5 일반 무역 정보 조회 시작 (Think 단계)**

`POST /api/search/general/start`

- **설명** : 일반 무역 정보(뉴스, 정책 등) 조회를 위한 비동기 작업을 시작하고, 스트리밍 URL을 반환합니다. (관련 유스케이스 : `UC_009`, 관련 기능 요구사항 : `FR-AD-008`)
- **Authorization** : `Bearer {accessToken}`
- **Request Body**
    
    ```json
    {
      "query": "최근 미국의 관세 정책에 대해서 알려줘",
      "additionalContext": {
        "region": "미국",
        "timeframe": "최근"
      }
    }
    
    ```
    
- **Response (202 Accepted)**
    
    ```json
    {
      "success": "SUCCESS",
      "message": "일반 무역 정보 조회를 시작합니다",
      "data": {
        "jobId": "job_987654321",
        "status": "THINKING",
        "estimatedTime": 25,
        "streamUrl": "/api/search/general/stream/job_987654321"
      }
    }
    
    ```
    

### **3.6 일반 무역 정보 조회 스트리밍 (SSE)**

`GET /api/search/general/stream/{jobId}`

- **설명** : SSE를 사용하여 일반 무역 정보 조회 결과를 실시간으로 스트리밍합니다. (3.3과 유사한 구조)
- **Authorization** : `Bearer {accessToken}`
- **Produces** : `text/event-stream`
- **SSE Event Stream**
    
    ```json
    event: stream_end
    data: {
      "finalData": {
        "answer": "최근 미국의 관세 정책은 다음과 같은 주요 변화가 있었습니다...",
        "relatedNews": [
          {
            "title": "미국 관세청 새로운 정책 발표",
            "url": "https://...",
            "sourceName": "미국 관세청",
            "publishedAt": "2024-01-10T09:00:00Z"
          }
        ],
        "sources": [
          {"title": "미국 관세청 공식 발표", "url": "https://...", "type": "OFFICIAL"},
          {"title": "무역협회 분석 보고서", "url": "https://...", "type": "ANALYSIS"}
        ],
        "relatedTopics": ["미국-중국 무역관계", "WTO 규정 변화"]
      }
    }
    
    ```
    
- **Errors** : `SEARCH_002`, `SEARCH_005`

## **4. 북마크 API (Bookmark)**

사용자가 관심 있는 HS Code나 화물 정보를 저장하고 관리하는 기능을 제공합니다.

### **4.1 북마크 목록 조회**

`GET /api/bookmarks?type={type}&offset=0&limit=20`

- **설명** : 사용자가 저장한 북마크 목록을 페이지네이션하여 조회합니다. (관련 유스케이스 : `UC-011`, `UC-012`, 관련 기능 요구사항 : `FR-AD-009`)
- **Authorization** : `Bearer {accessToken}`
- **Query Parameters**
    - `type` (string, optional) : `HS_CODE` | `CARGO`
    - `offset` (integer, optional, default: 0) : 페이지 오프셋
    - `limit` (integer, optional, default: 20) : 페이지 크기
- **Response (200 OK)**
    
    ```json
    {
      "success": "SUCCESS",
      "message": "북마크 목록 조회 완료",
      "data": {
        "content": [
          {
            "id": 1,
            "type": "HS_CODE",
            "targetValue": "8517.12.00",
            "displayName": "스마트폰 (아이폰 15)",
            "monitoringEnabled": true,
            "createdAt": "2024-01-15T09:00:00Z"
          }
        ],
        "offset": 0,
        "limit": 20,
        "total": 1,
        "hasNext": false
      }
    }
    
    ```
    

### **4.2 북마크 추가**

`POST /api/bookmarks`

- **설명** : 새로운 HS Code 또는 화물 정보를 북마크에 추가합니다. 북마크 추가 시, 시스템은 해당 항목에 대한 모니터링을 자동으로 시작합니다. (관련 유스케이스 : `UC-011`)
- **Authorization** : `Bearer {accessToken}`
- **Request Body**
    
    ```json
    {
      "type": "HS_CODE",
      "targetValue": "8517.12.00",
      "displayName": "스마트폰 (아이폰 15)"
    }
    
    ```
    
- **Response (201 Created)** : 성공적으로 생성된 북마크 정보를 반환합니다.

### **4.3 북마크 수정**

`PUT /api/bookmarks/{bookmarkId}`

- **설명** : 북마크의 표시 이름이나 모니터링 활성화 여부를 수정합니다. (관련 유스케이스 : `UC-011`)
- **Authorization** : `Bearer {accessToken}`
- **Path Parameters**
    - `bookmarkId` (integer, required) : 수정할 북마크의 ID
- **Request Body**
    
    ```json
    {
      "displayName": "Apple iPhone 15 Series",
      "monitoringEnabled": false
    }
    
    ```
    
- **Response (200 OK)** : 수정된 북마크 정보를 반환합니다.

### **4.4 북마크 삭제**

`DELETE /api/bookmarks/{bookmarkId}`

- **설명** : 지정된 북마크를 삭제합니다. (관련 유스케이스 : `UC-011`)
- **Authorization** : `Bearer {accessToken}`
- **Path Parameters**
    - `bookmarkId` (integer, required) : 삭제할 북마크의 ID
- **Response (204 No Content)** : 성공적으로 삭제되면 `data`가 `null`인 응답을 반환합니다.
- **Errors** : `BOOKMARK_001` (북마크 찾을 수 없음)

## **5. 대시보드 API (Dashboard)**

사용자 개인화 정보를 요약하여 보여주는 대시보드 관련 기능을 제공합니다.

### **5.1 업데이트 피드 조회**

`GET /api/dashboard/feeds?offset=0&limit=20&unreadOnly=false`

- **설명** : 북마크한 항목에 대한 변동사항(예: 관세율 변경, 통관 완료 등)을 시간순으로 조회합니다. (관련 유스케이스 : `UC-012`, `UC-016`)
- **Authorization** : `Bearer {accessToken}`
- **Query Parameters**
    - `offset`, `limit`
    - `unreadOnly` (boolean, optional) : `true`일 경우, 읽지 않은 피드만 조회
- **Response (200 OK)**
    
    ```json
    {
      "success": "SUCCESS",
      "message": "업데이트 피드 조회 완료",
      "data": {
        "content": [
          {
            "id": 1,
            "feedType": "HS_CODE_CHANGE",
            "targetType": "HS_CODE",
            "targetValue": "8517.12.00",
            "title": "스마트폰 관세율 변경",
            "content": "미국향 스마트폰 관세율이 5%에서 3%로 인하되었습니다.",
            "sourceUrl": "https://...",
            "isRead": false,
            "createdAt": "2024-01-15T10:00:00Z"
          }
        ],
        "offset": 0,
        "limit": 20,
        "total": 1,
        "hasNext": false
      }
    }
    
    ```
    

### **5.2 피드 읽음 처리**

`PUT /api/dashboard/feeds/{feedId}/read`

- **설명** : 특정 업데이트 피드를 읽음 상태로 변경합니다.
- **Authorization** : `Bearer {accessToken}`
- **Path Parameters**
    - `feedId` (integer, required) : 피드 ID
- **Response (200 OK)** : `data`가 `null`인 성공 응답을 반환합니다.

### **5.3 대시보드 요약 정보**

`GET /api/dashboard/summary`

- **설명** : 대시보드 상단에 표시될 요약 정보(총 북마크 수, 모니터링 수, 안 읽은 피드 수 등)를 조회합니다. (관련 유스케이스 : `UC-012`)
- **Authorization** : `Bearer {accessToken}`
- **Response (200 OK)**
    
    ```json
    {
      "success": "SUCCESS",
      "message": "대시보드 요약 정보",
      "data": {
        "totalBookmarks": 5,
        "activeMonitoring": 3,
        "unreadFeeds": 2,
        "recentActivity": [
          {
            "type": "BOOKMARK_ADDED",
            "message": "새로운 HS Code 북마크 추가",
            "timestamp": "2024-01-15T09:30:00Z"
          }
        ]
      }
    }
    
    ```
    

## **10. 공통 에러 코드 (Common Error Codes)**

오류 발생 시, API는 **1.3 공통 응답 형식**에 따라 `success`가 `ERROR`로, `data`가 `null`로 설정된 표준 응답을 반환합니다. `message` 필드에는 아래 표에 정의된 내용이 포함될 수 있습니다.

| **코드**              | **메시지**                | **설명**                                             |
| --------------------- | ------------------------- | ---------------------------------------------------- |
| **인증 (AUTH_xxx)**   |                           |                                                      |
| `AUTH_001`            | 잘못된 인증 정보          | 이메일 또는 비밀번호가 일치하지 않습니다.            |
| `AUTH_002`            | 계정이 잠겨있음           | 로그인 시도 실패 횟수 초과 등으로 계정이 잠겼습니다. |
| `AUTH_003`            | 토큰이 만료됨             | Access Token 또는 Refresh Token이 만료되었습니다.    |
| `AUTH_004`            | 토큰이 유효하지 않음      | 토큰 형식이 잘못되었거나 서명이 유효하지 않습니다.   |
| `AUTH_005`            | 권한이 없음               | 해당 리소스에 접근할 수 있는 권한이 없습니다.        |
| **사용자 (USER_xxx)** |                           |                                                      |
| `USER_001`            | 이메일이 이미 사용중      | 다른 사용자가 이미 사용하고 있는 이메일입니다.       |
| `USER_002`            | 유효하지 않은 이메일 형식 | 이메일 형식이 올바르지 않습니다.                     |
| **검색 (SEARCH_xxx)** |                           |                                                      |
| `SEARCH_001`          | 검색어가 비어있음         | 검색어가 제공되지 않았습니다.                        |
| `SEARCH_002`          | 분석 작업을 찾을 수 없음  | 요청한 Job ID에 해당하는 분석 작업이 없습니다.       |
| `SEARCH_003`          | 분석 작업이 실패함        | AI 분석 또는 데이터 수집 중 오류가 발생했습니다.     |
| **공통 (COMMON_xxx)** |                           |                                                      |
| `COMMON_001`          | 잘못된 요청 형식          | 요청 파라미터나 Body 형식이 잘못되었습니다.          |
| `COMMON_002`          | 서버 내부 오류            | 예상치 못한 서버 오류가 발생했습니다.                |