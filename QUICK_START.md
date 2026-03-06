# 🚀 QUICK START - Test Employee APIs

## ⚡ STEP 1: Create Department First (Required)

Before creating employees, you need a valid `dept_id`. 

### Option A: Use Existing Department
Check your database for existing department `_id`:
```javascript
// In MongoDB Compass or Atlas
db.departments.findOne()
```
Copy the `_id` value (e.g., `"67a1234567890abcdef12340"`)

### Option B: Create New Department via API
```
POST http://localhost:5000/api/departments
Content-Type: application/json

{
  "deptName": "IT",
  "deptCode": "IT001"
}
```

Save the returned `_id` from response!

---

## ⚡ STEP 2: Create Employee

**API Endpoint:**
```
POST http://localhost:5000/api/empReg
```

**Request Body:**
```json
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

⚠️ **Replace `dept_id` with your actual department `_id`!**

**Expected Response:**
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
    "dept_id": "67a1234567890abcdef12340",
    "gender": "Male",
    "qualification": "MBA",
    "email": "john.doe@example.com",
    "mobileNo": "9876543210",
    "password": "$2a$10$hashed...",
    "accessRights": ["ADMIN", "HR", "MANAGE_EMPLOYEES"],
    "isBlocked": false
  }
}
```

✅ **COPY THE `_id` VALUE** - You'll need it for all other APIs!

---

## ⚡ STEP 3: Test All Employee APIs

Replace `YOUR_EMPLOYEE_ID` with the `_id` from above (e.g., `69a18858e0cd7077fed08847`)

### 1. Get Employee by ID
```
GET http://localhost:5000/api/employees/YOUR_EMPLOYEE_ID
```

### 2. Update Password
```
PUT http://localhost:5000/api/employees/YOUR_EMPLOYEE_ID/password
Content-Type: application/json

{
  "oldPassword": "password123",
  "newPassword": "newpassword456",
  "confirmPassword": "newpassword456"
}
```

### 3. Block Employee
```
PUT http://localhost:5000/api/employees/YOUR_EMPLOYEE_ID/block
```

### 4. Update Rights
```
PUT http://localhost:5000/api/employees/YOUR_EMPLOYEE_ID/rights
Content-Type: application/json

{
  "accessRights": ["ADMIN", "HR", "FINANCE"]
}
```

### 5. Get All Blocked Employees
```
GET http://localhost:5000/api/employees/blocked
```

### 6. Get Employees by Rights
```
GET http://localhost:5000/api/employees/rights?right=ADMIN
```

### 7. Delete Employee
```
DELETE http://localhost:5000/api/employees/YOUR_EMPLOYEE_ID
```

---

## 📋 COMPLETE TEST DATA

### Employee 1 (Admin)
```json
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

### Employee 2 (HR)
```json
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

### Employee 3 (Finance)
```json
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

---

## 🔍 TROUBLESHOOTING

### Error: "Employee not found"
- Make sure you created an employee first using `POST /empReg`
- Use the `_id` from response, not `employeeId`

### Error: "Cast to ObjectId failed"
- Ensure `dept_id` is a valid 24-character MongoDB ObjectId
- Check your department exists in database

### Error: "Old password is incorrect"
- Passwords are case-sensitive
- Remember password is hashed on first save

---

## ✅ API SUMMARY

| API | Method | Endpoint |
|-----|--------|----------|
| Create Employee | POST | `/api/empReg` |
| Get Employee | GET | `/api/employees/:id` |
| Update Password | PUT | `/api/employees/:id/password` |
| Block Employee | PUT | `/api/employees/:id/block` |
| Update Rights | PUT | `/api/employees/:id/rights` |
| Get Blocked | GET | `/api/employees/blocked` |
| Get by Rights | GET | `/api/employees/rights?right=ADMIN` |
| Delete Employee | DELETE | `/api/employees/:id` |

---

**Restart your server after making changes!**
```bash
npm start
```
