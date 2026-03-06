# 🚀 New APIs - Postman Testing Guide

## Base URL
```
http://localhost:5000/api
```

---

## 🔥 FIRST: Create Employee (Registration)

### Register Employee
```
POST /empReg
```

**Postman Example:**
```
POST http://localhost:5000/api/empReg
Content-Type: application/json

Body:
{
  "fname": "John",
  "mname": "Kumar",
  "lname": "Doe",
  "designation": "Manager",
  "dept_id": "67a1234567890abcdef12340",
  "gender": "Male",
  "qualification": "MBA",
  "email": "john.doe@example.com",
  "mobileNo": "9876543210",
  "password": "password123",
  "accessRights": ["ADMIN", "HR", "MANAGE_EMPLOYEES"],
  "isBlocked": false
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Employee Registered Successfully",
  "data": {
    "_id": "69a18858e0cd7077fed08847",
    "fname": "John",
    "mname": "Kumar",
    "lname": "Doe",
    "designation": "Manager",
    "email": "john.doe@example.com",
    "mobileNo": "9876543210",
    "accessRights": ["ADMIN", "HR", "MANAGE_EMPLOYEES"],
    "isBlocked": false
  }
}
```

⚠️ **Save the `_id` from response** - you'll need it for other APIs!

---

## ✅ EMPLOYEE APIs

### 1. Get Employee by Employee ID (MongoDB _id)
```
GET /employees/:employeeId
```

**Postman Example:**
```
GET http://localhost:5000/api/employees/69a18858e0cd7077fed08847
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "69a18858e0cd7077fed08847",
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
PUT http://localhost:5000/api/employees/69a18858e0cd7077fed08847/password
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
DELETE http://localhost:5000/api/employees/69a18858e0cd7077fed08847
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
PUT http://localhost:5000/api/employees/69a18858e0cd7077fed08847/block
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Employee blocked successfully",
  "data": {
    "_id": "69a18858e0cd7077fed08847",
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
      "fname": "John",
      "lname": "Doe",
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
PUT http://localhost:5000/api/employees/69a18858e0cd7077fed08847/rights
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
    "_id": "69a18858e0cd7077fed08847",
    "fname": "John",
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
      "fname": "John",
      "lname": "Doe",
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
```/registration/enquiry/:enquiryNumber
GET 
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

### Create Employee 1 (Admin)
```
POST http://localhost:5000/api/empReg
Content-Type: application/json

{
  "fname": "John",
  "mname": "Kumar",
  "lname": "Doe",
  "designation": "Manager",
  "dept_id": "67a1234567890abcdef12340",
  "gender": "Male",
  "qualification": "MBA",
  "email": "john.doe@example.com",
  "mobileNo": "9876543210",
  "password": "password123",
  "accessRights": ["ADMIN", "HR", "MANAGE_EMPLOYEES"]
}
```

### Create Employee 2 (HR)
```
POST http://localhost:5000/api/empReg
Content-Type: application/json

{
  "fname": "Sarah",
  "mname": "",
  "lname": "Johnson",
  "designation": "HR Executive",
  "dept_id": "67a1234567890abcdef12340",
  "gender": "Female",
  "qualification": "MBA HR",
  "email": "sarah.j@example.com",
  "mobileNo": "8765432109",
  "password": "secure123",
  "accessRights": ["HR", "RECRUITMENT"]
}
```

### Create Employee 3 (Finance)
```
POST http://localhost:5000/api/empReg
Content-Type: application/json

{
  "fname": "Michael",
  "mname": "James",
  "lname": "Brown",
  "designation": "Accountant",
  "dept_id": "67a1234567890abcdef12340",
  "gender": "Male",
  "qualification": "B.Com",
  "email": "michael.b@example.com",
  "mobileNo": "7654321098",
  "password": "finance123",
  "accessRights": ["FINANCE", "ACCOUNTS"]
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

### Step 1: Create Employees First
1. `POST /empReg` - Create John (Admin) → Save `_id`
2. `POST /empReg` - Create Sarah (HR)
3. `POST /empReg` - Create Michael (Finance)

### Step 2: Test Employee APIs
4. `GET /employees/<John's _id>` ✅
5. `PUT /employees/<John's _id>/password` ✅
6. `PUT /employees/<John's _id>/rights` ✅
7. `PUT /employees/<John's _id>/block` ✅
8. `GET /employees/blocked` ✅
9. `GET /employees/rights?right=ADMIN` ✅
10. `DELETE /employees/<John's _id>` ✅ (test at end)

### Step 3: Test Course API
11. `GET /courses/search/Full Stack Development` ✅

### Step 4: Test Student API
12. `GET /registration/enquiry/ENQ-2025-001` ✅

---

## ⚠️ NOTES

- **dept_id**: You need a valid department MongoDB ObjectId. First create a department or use existing one's `_id`
- **Password is auto-hashed** on save (in empReg.controller.js)
- **accessRights** is an array of strings
- **isBlocked** defaults to false
- All employee APIs use MongoDB `_id`, not numeric ID
