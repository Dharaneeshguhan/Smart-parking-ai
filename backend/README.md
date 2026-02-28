# Smart Parking System Backend

## 🚀 Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

### Database Setup

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE smart_parking;
   ```

2. **Run the setup script:**
   ```bash
   mysql -u root -p < database_setup.sql
   ```

### Application Configuration

1. **Update database credentials** in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/smart_parking?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

2. **Install dependencies:**
   ```bash
   mvn clean install
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080/api`

## 🔐 Authentication Endpoints

### Register User
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "driver"  // or "owner"
}
```

### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "ROLE_DRIVER"
}
```

## 🏗️ Project Structure

```
src/main/java/com/example/backend/
├── config/
│   ├── SecurityConfig.java
│   └── DataInitializer.java
├── controller/
│   └── AuthController.java
├── dto/
│   ├── LoginRequest.java
│   ├── SignupRequest.java
│   └── JwtResponse.java
├── entity/
│   ├── User.java
│   └── Role.java
├── repository/
│   ├── UserRepository.java
│   └── RoleRepository.java
├── security/
│   ├── JwtUtils.java
│   ├── UserDetailsImpl.java
│   ├── UserDetailsServiceImpl.java
│   └── JwtAuthenticationFilter.java
└── service/
    └── AuthService.java
```

## 🔧 Features Implemented

- ✅ User Registration (Driver/Owner roles)
- ✅ User Authentication with JWT
- ✅ Password Encryption with BCrypt
- ✅ Role-based Authorization
- ✅ CORS Configuration
- ✅ Input Validation
- ✅ Database Integration with JPA

## 🌐 Frontend Integration

The frontend is already configured to connect to this backend at `http://localhost:8080/api`

Make sure the backend is running before testing the frontend authentication features.

## 🧪 Testing

You can test the endpoints using:
- Postman
- curl commands
- Frontend application

### Example curl commands:

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "driver"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔒 Security Features

- JWT-based authentication
- Password encryption with BCrypt
- CORS configuration for frontend
- Role-based access control
- Input validation and sanitization

## 📝 Next Steps

To complete the full parking system, you can extend this backend with:
- Parking slot management
- Booking system
- Payment integration
- Real-time availability updates
- Location-based search
