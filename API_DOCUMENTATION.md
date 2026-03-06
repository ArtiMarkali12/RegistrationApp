# 🚀 New APIs - Postman Testing Guide

## Base URL
```
http://localhost:5000/api
```

---

## ✅ EMPLOYEE APIs

### 1. Get Employee by Employee ID
```
GET /employees/:employeeId
```

**Postman Example:**
```
GET http://localhost:5000/api/employees/101
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "employeeId": 101,
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com",
    "designation": "Manager",
    "accessRights": ["ADMIN", "HR"],
    "isBlocked": false
  }
}
```

---

### 2. Update Employee Password (using old password)
```
PUT /employees/:employeeId/password
```

**Postman Example:**
```
PUT http://localhost:5000/api/employees/101/password
Content-Type: application/json

Body:
{
  "oldPassword": "password123",
  "newPassword": "newpassword456",
  "confirmPassword": "newpassword456"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Error Responses:**
- `400` - Passwords don't match or too short
- `401` - Old password incorrect
- `404` - Employee not found

---

### 3. Delete Employee
```
DELETE /employees/:employeeId
```

**Postman Example:**
```
DELETE http://localhost:5000/api/employees/101
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

---

### 4. Block Employee
```
PUT /employees/:employeeId/block
```

**Postman Example:**
```
PUT http://localhost:5000/api/employees/101/block
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Employee blocked successfully",
  "data": {
    "_id": "...",
    "employeeId": 101,
    "fname": "John",
    "isBlocked": true
  }
}
```

---

### 5. Get All Blocked Employees
```
GET /employees/blocked
```

**Postman Example:**
```
GET http://localhost:5000/api/employees/blocked
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "employeeId": 101,
      "fname": "John",
      "isBlocked": true
    }
  ]
}
```

---

### 6. Update Employee Rights
```
PUT /employees/:employeeId/rights
```

**Postman Example:**
```
PUT http://localhost:5000/api/employees/101/rights
Content-Type: application/json

Body:
{
  "accessRights": ["ADMIN", "HR", "FINANCE", "MANAGE_COURSES"]
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Employee rights updated successfully",
  "data": {
    "_id": "...",
    "employeeId": 101,
    "accessRights": ["ADMIN", "HR", "FINANCE", "MANAGE_COURSES"]
  }
}
```

---

### 7. Get Employees by Access Rights
```
GET /employees/rights?right=<RIGHT_NAME>
```

**Postman Examples:**
```
GET http://localhost:5000/api/employees/rights?right=ADMIN
GET http://localhost:5000/api/employees/rights?right=HR
GET http://localhost:5000/api/employees/rights
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "employeeId": 101,
      "fname": "John",
      "accessRights": ["ADMIN", "HR"]
    }
  ]
}
```

---

## ✅ COURSE APIs

### 8. Get Course by Name or ID
```
GET /courses/search/:identifier
```

**Postman Examples:**
```
GET http://localhost:5000/api/courses/search/Full Stack Development
GET http://localhost:5000/api/courses/search/67a1234567890abcdef12346
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "67a1234567890abcdef12346",
    "name": "Full Stack Development",
    "feesAmount": 50000,
    "duration": "6 months"
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "Course not found"
}
```

---

## ✅ STUDENT APIs

### 9. Get Student by Enquiry Number
```
GET /registration/enquiry/:enquiryNumber
```

**Postman Example:**
```
GET http://localhost:5000/api/registration/enquiry/ENQ-2025-001
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "registration_no": "ENQ-2025-001",
    "fname": "Jane",
    "lname": "Smith",
    "contact": "9123456789",
    "email": "jane@example.com",
    "eid": {
      "fname": "John",
      "lname": "Doe",
      "designation": "Manager"
    },
    "courseId": {
      "name": "Full Stack Development",
      "feesAmount": 50000
    }
  }
}
```

---

## 📝 SAMPLE TEST DATA FOR POSTMAN

### Create Employee (First create this)
```
POST http://localhost:5000/api/employees
Content-Type: application/json

{
  "employeeId": 101,
  "fname": "John",
  "lname": "Doe",
  "email": "john.doe@example.com",
  "mobileNo": "9876543210",
  "password": "password123",
  "designation": "Manager",
  "gender": "Male",
  "qualification": "MBA",
  "accessRights": ["ADMIN", "HR", "MANAGE_EMPLOYEES"],
  "isBlocked": false
}
```

### Create Another Employee
```
POST http://localhost:5000/api/employees
Content-Type: application/json

{
  "employeeId": 102,
  "fname": "Sarah",
  "lname": "Johnson",
  "email": "sarah.j@example.com",
  "mobileNo": "8765432109",
  "password": "secure123",
  "designation": "HR Executive",
  "gender": "Female",
  "qualification": "MBA HR",
  "accessRights": ["HR", "RECRUITMENT"],
  "isBlocked": false
}
```

### Create Course
```
POST http://localhost:5000/api/courses
Content-Type: application/json

{
  "name": "Full Stack Development",
  "feesAmount": 50000,
  "feesPolicy": "Payable in 2 installments",
  "duration": "6 months",
  "requiredQualification": ["Graduate", "12th Pass"]
}
```

---

## 🧪 TESTING SEQUENCE

1. **First:** Create employee with POST `/employees`
2. **Then test:**
   - GET `/employees/101` ✅
   - PUT `/employees/101/password` ✅
   - PUT `/employees/101/rights` ✅
   - PUT `/employees/101/block` ✅
   - GET `/employees/blocked` ✅
   - GET `/employees/rights?right=ADMIN` ✅
   - DELETE `/employees/101` ✅

3. **For Course:**
   - GET `/courses/search/Full Stack Development` ✅

4. **For Student:**
   - GET `/registration/enquiry/ENQ-2025-001` ✅

---

## ⚠️ NOTES

- Password is auto-hashed on save
- Employee ID must be unique
- Access rights is an array of strings
- isBlocked defaults to false
