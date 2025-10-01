# 🚀 POSTMAN API TESTING GUIDE - CRYPTO PORTFOLIO APP

## 📋 SETUP INSTRUCTIONS

### 1. START SERVER FIRST
Make sure your server is running on: http://127.0.0.1:8000

### 2. POSTMAN COLLECTION SETUP
1. Open Postman
2. Create new Collection: "Crypto Portfolio API Tests"
3. Set Base URL Variable: `{{base_url}}` = `http://127.0.0.1:8000`

---

## 🔍 TEST ENDPOINTS (Copy these into Postman)

### ✅ 1. HEALTH CHECK
- **Method**: GET
- **URL**: `{{base_url}}/health`
- **Expected**: 200 OK
- **Response**: 
```json
{
  "status": "healthy",
  "timestamp": "2025-10-01T...",
  "version": "1.0.0",
  "app_name": "Crypto Portfolio API"
}
```

### ✅ 2. ROOT ENDPOINT
- **Method**: GET
- **URL**: `{{base_url}}/`
- **Expected**: 200 OK
- **Response**: 
```json
{
  "message": "Welcome to Crypto Portfolio API"
}
```

### ✅ 3. API DOCUMENTATION
- **Method**: GET
- **URL**: `{{base_url}}/docs`
- **Expected**: 200 OK (HTML page)

---

## 🔐 AUTHENTICATION ENDPOINTS

### ✅ 4. USER LOGIN (SAVE TOKEN!)
- **Method**: POST
- **URL**: `{{base_url}}/api/auth/login`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "username": "demo@crypto-portfolio.com",
  "password": "DemoPass123!"
}
```
- **Expected**: 200 OK
- **Response**: 
```json
{
  "access_token": "eyJ0eXAiOiJKV1Q...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": 1,
    "username": "demo",
    "email": "demo@crypto-portfolio.com",
    "is_verified": true
  }
}
```
⚠️ **IMPORTANT**: Copy the `access_token` value - you'll need it for protected endpoints!

### ✅ 5. USER REGISTRATION
- **Method**: POST
- **URL**: `{{base_url}}/api/auth/register`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "NewPass123!",
  "first_name": "New",
  "last_name": "User"
}
```
- **Expected**: 201 Created

### ✅ 6. GET USER PROFILE (Protected)
- **Method**: GET
- **URL**: `{{base_url}}/api/auth/profile`
- **Headers**: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Expected**: 200 OK
- **Response**: 
```json
{
  "id": 1,
  "username": "demo",
  "email": "demo@crypto-portfolio.com",
  "first_name": "Demo",
  "last_name": "User",
  "timezone": "UTC",
  "preferred_currency": "USD",
  "is_active": true,
  "is_verified": true,
  "created_at": "2025-10-01T..."
}
```

### ✅ 7. TOKEN VERIFICATION (Protected)
- **Method**: POST
- **URL**: `{{base_url}}/api/auth/verify-token`
- **Headers**: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Expected**: 200 OK

---

## 💼 PORTFOLIO ENDPOINTS (All Protected)

### ✅ 8. PORTFOLIO OVERVIEW
- **Method**: GET
- **URL**: `{{base_url}}/api/portfolio`
- **Headers**: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Expected**: 200 OK
- **Response**: Portfolio holdings and summary

### ✅ 9. PORTFOLIO OVERVIEW (Alternative)
- **Method**: GET
- **URL**: `{{base_url}}/api/overview`
- **Headers**: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Expected**: 200 OK

---

## 📈 P&L (PROFIT & LOSS) ENDPOINTS (All Protected)

### ✅ 10. P&L SUMMARY
- **Method**: GET
- **URL**: `{{base_url}}/api/pnl/summary`
- **Headers**: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Expected**: 200 OK
- **Response**: 
```json
{
  "total_portfolio_value": 12500.00,
  "total_pnl": 2500.00,
  "pnl_percentage": 25.0
}
```

### ✅ 11. P&L DETAILS
- **Method**: GET
- **URL**: `{{base_url}}/api/pnl/details`
- **Headers**: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Expected**: 200 OK

### ✅ 12. P&L HISTORY
- **Method**: GET
- **URL**: `{{base_url}}/api/pnl/history`
- **Headers**: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Expected**: 200 OK

---

## 💼 TRADES ENDPOINTS (All Protected)

### ✅ 13. ALL TRADES
- **Method**: GET
- **URL**: `{{base_url}}/api/trades`
- **Headers**: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Expected**: 200 OK
- **Response**: Array of trade objects

### ✅ 14. RECENT TRADES
- **Method**: GET
- **URL**: `{{base_url}}/api/trades/recent`
- **Headers**: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Expected**: 200 OK

---

## 🚫 ERROR TESTING

### ✅ 15. INVALID TOKEN
- **Method**: GET
- **URL**: `{{base_url}}/api/auth/profile`
- **Headers**: 
  - `Authorization: Bearer invalid_token_here`
- **Expected**: 401 Unauthorized

### ✅ 16. MISSING TOKEN
- **Method**: GET
- **URL**: `{{base_url}}/api/auth/profile`
- **Headers**: (none)
- **Expected**: 401/403 Unauthorized

### ✅ 17. WRONG CREDENTIALS
- **Method**: POST
- **URL**: `{{base_url}}/api/auth/login`
- **Body**:
```json
{
  "username": "demo@crypto-portfolio.com",
  "password": "WrongPassword"
}
```
- **Expected**: 401 Unauthorized

---

## 🎯 QUICK TESTING WORKFLOW

### Step 1: Basic Health
1. Test Health Check (Test #1)
2. Test Root Endpoint (Test #2)

### Step 2: Authentication Flow
1. Login with demo user (Test #4) → Save token
2. Get user profile (Test #6) → Use saved token
3. Verify token (Test #7) → Use saved token

### Step 3: Protected Endpoints
1. Portfolio overview (Test #8) → Use saved token
2. P&L summary (Test #10) → Use saved token  
3. All trades (Test #13) → Use saved token

### Step 4: Error Handling
1. Test invalid token (Test #15)
2. Test missing token (Test #16)

---

## 📊 EXPECTED RESULTS

✅ **SUCCESS INDICATORS:**
- Health/Root: 200 OK
- Login: 200 OK with JWT token
- Protected endpoints: 200 OK with valid data
- Registration: 201 Created

❌ **ERROR INDICATORS:**
- Invalid/missing auth: 401 Unauthorized
- Wrong credentials: 401 Unauthorized
- Invalid data: 422 Validation Error

---

## 🔧 POSTMAN TIPS

1. **Environment Variables**: Set `{{base_url}}` = `http://127.0.0.1:8000`
2. **Token Management**: Save token from login response as `{{auth_token}}`
3. **Headers Template**: `Authorization: Bearer {{auth_token}}`
4. **Collection Runner**: Run all tests in sequence
5. **Tests Tab**: Add assertions to validate responses

---

## 🎉 DEMO CREDENTIALS

**Demo User:**
- Username: `demo@crypto-portfolio.com`
- Password: `DemoPass123!`

**Admin User:**
- Username: `admin@crypto-portfolio.com` 
- Password: `AdminPass123!`

---

Start with Tests #1-4 to verify basic functionality! 🚀