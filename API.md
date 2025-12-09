# Finance Tracker REST API - Endpoints Documentation

This documentation describes all available endpoints in the Finance Tracker API.

## Base URL

```
http://localhost:3000
```

---

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Root](#root)

---

## Authentication

### Login

Authenticates a user and returns an access token.

**Endpoint:** `POST /users/auth/login`

**Body (JSON):**
```json
{
  "username": "string",
  "password": "string"
}
```

**Request Example:**
```bash
curl -X POST http://localhost:3000/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "password123"
  }'
```

**Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (200 OK):**
```json
{
  "message": "Invalid username or password"
}
```

---

## Users

### Create User

Creates a new user in the system.

**Endpoint:** `POST /users`

**Body (JSON):**
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

**Validations:**
- `username`: required, string type
- `password`: required, string type
- `email`: required, must be a valid email

**Request Example:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "mary",
    "password": "password456",
    "email": "mary@email.com"
  }'
```

**Success Response (201 Created):**
```json
{
  "message": "User created",
  "user": {
    "id": 1,
    "username": "mary",
    "email": "mary@email.com"
  }
}
```

**Note:** The password is not returned in the response for security reasons.

---

### Get All Users

Returns a list of all registered users.

**Endpoint:** `GET /users`

**Request Example:**
```bash
curl -X GET http://localhost:3000/users
```

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "mary",
    "email": "mary@email.com"
  },
  {
    "id": 2,
    "username": "john",
    "email": "john@email.com"
  }
]
```

**Note:** Passwords are not returned in the response for security reasons.

---

### Get User by ID

Returns data for a specific user by their ID.

**Endpoint:** `GET /users/:id`

**URL Parameters:**
- `id` (number): User ID

**Request Example:**
```bash
curl -X GET http://localhost:3000/users/1
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "username": "mary",
  "email": "mary@email.com"
}
```

**Response when user does not exist (200 OK):**
```json
{
  "message": "User not found"
}
```

---

### Get User by Username

Returns data for a specific user by their username.

**Endpoint:** `POST /users/user`

**Query Parameters:**
- `username` (string): Username of the user to search for

**Request Example:**
```bash
curl -X POST http://localhost:3000/users/user?username=mary
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "username": "mary",
  "email": "mary@email.com"
}
```

**Response when user does not exist (200 OK):**
```json
{
  "message": "User not found"
}
```

---

### Update Password

Updates a user's password. Requires the old password for validation.

**Endpoint:** `PUT /users/:id`

**URL Parameters:**
- `id` (number): User ID

**Body (JSON):**
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

**Request Example:**
```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "password456",
    "newPassword": "newPassword789"
  }'
```

**Success Response (200 OK):**
```json
{
  "message": "Password updated successfully"
}
```

**Error Response (200 OK):**
```json
{
  "message": "Specific error message"
}
```

**Possible Errors:**
- Incorrect old password
- User not found

---

### Delete User

Removes a user from the system.

**Endpoint:** `DELETE /users/:id/delete`

**URL Parameters:**
- `id` (number): ID of the user to be deleted

**Request Example:**
```bash
curl -X DELETE http://localhost:3000/users/1/delete
```

**Success Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Root

### Hello World

Application test/health check endpoint.

**Endpoint:** `GET /`

**Request Example:**
```bash
curl -X GET http://localhost:3000/
```

**Success Response (200 OK):**
```
Hello World!
```

---

## HTTP Status Codes

The API uses the following HTTP status codes:

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid data in request
- `401 Unauthorized` - Authentication required or invalid
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Internal server error

---

## Security Notes

1. **Passwords:** Passwords are stored encrypted using bcrypt
2. **JWT Tokens:** Authentication uses JWT tokens for access to protected resources
3. **Sensitive Data:** Passwords are never returned in API responses

---

## Complete Usage Examples

### Complete Flow: Create and Authenticate User

```bash
# 1. Create a new user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test",
    "password": "test123",
    "email": "test@email.com"
  }'

# 2. Login with the created user
curl -X POST http://localhost:3000/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test",
    "password": "test123"
  }'

# 3. List all users
curl -X GET http://localhost:3000/users

# 4. Get specific user by ID
curl -X GET http://localhost:3000/users/1

# 5. Update user password
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "test123",
    "newPassword": "newPassword456"
  }'
```

---

## Technologies Used

- **Framework:** NestJS
- **Database:** PostgreSQL (via TypeORM)
- **Authentication:** JWT (JSON Web Tokens)
- **Encryption:** bcrypt
- **Validation:** class-validator

---

## Support

For questions or support, please open an issue in the project repository.
