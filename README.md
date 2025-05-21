
This project demonstrates comprehensive CI/CD implementation using GitHub Actions, featuring automated testing, linting, and deployment workflows.

## 🚀 CI/CD Implementation

### Automated Testing Pipeline
The project implements a robust CI/CD pipeline using GitHub Actions that runs on every push and pull request:

```yaml
name: Backend Tests & Deployment

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

#### Test Stage
- **Syntax & Lint Checks**
  - ESLint validation
  - Code style enforcement
  - Error detection

- **API Endpoint Testing**
  - Authentication endpoints
  - Book management endpoints
  - Request/response validation
  - Status code verification

- **Database Validation**
  - Connection testing
  - CRUD operations
  - Data integrity checks

#### Deployment Stage
- Automatic deployment to Render platform
- Deployment only proceeds after successful tests
- Real-time deployment status notifications

## 🧪 Test Coverage

### Unit Tests
- **Authentication Tests**
- **Book Management Tests**
### Integration Tests
- **API Integration**
### Database Tests
- **Connection Validation**
## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Testing:** 
  - Jest
  - Supertest
  - MongoDB Memory Server
- **CI/CD:** GitHub Actions
- **Deployment:** Render

## 📋 Prerequisites

- Node.js (v20.x or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kidabg548/book-reservation-backend.git
   cd book-reservation-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   
## 🧪 Running Tests

### Local Testing
Run all tests:
```bash
npm test
```

Run linting:
```bash
npm run lint
```
