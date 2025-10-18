# 🏛️ TrustLine

<div align="center">

![TrustLine Banner](https://via.placeholder.com/1200x300/4F46E5/FFFFFF?text=TrustLine+-+Civic+%26+Cyber+Issue+Reporting+Platform)

**A Smart Civic & Cyber Issue Reporting Platform for Government Services**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)](https://reactjs.org/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8.svg)](https://web.dev/progressive-web-apps/)

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [System Architecture](#-system-architecture)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Configuration](#️-configuration)
- [API Documentation](#-api-documentation)
- [PWA Features](#-pwa-features)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About

**TrustLine** is a comprehensive, government-grade web application designed to streamline civic and cyber issue reporting. With AI-powered issue detection, real-time geolocation tracking, and intelligent auto-prioritization, TrustLine empowers citizens to report issues efficiently while enabling administrators to manage and resolve them effectively.

### 🌟 Why TrustLine?

- **🤖 AI-Powered**: Automatically detects and categorizes issues within 2 minutes using Gemini API
- **📍 Geo-Location**: Precise location tagging for accurate issue mapping
- **⚡ Auto-Prioritization**: Escalates unresolved issues automatically
- **📱 Fully Responsive**: Seamless experience across desktop, tablet, and mobile
- **🔌 Offline Support**: PWA technology enables offline functionality
- **🏛️ Government Awareness**: Integrated services for civic education and awareness

---

## ✨ Key Features

### For Citizens

- **🎯 Smart Issue Reporting**
  - AI-based issue type detection (Civic/Cyber)
  - Auto-categorization within 2 minutes
  - Photo/video upload support
  - Geolocation integration

- **📊 Issue Tracking**
  - Real-time status updates
  - Progress notifications
  - Resolution timeline tracking
  - Historical issue records

- **🌐 Government Services**
  - Civic awareness programs
  - Educational resources
  - Emergency contact information
  - Service directory

### For Administrators

- **📈 Dashboard Analytics**
  - Issue statistics and trends
  - Priority-based queue management
  - Geographic heat maps
  - Performance metrics

- **⚙️ Issue Management**
  - Bulk operations support
  - Assignment workflows
  - Status tracking
  - Resolution documentation

- **🔔 Smart Notifications**
  - Real-time alerts via Kafka
  - Email/SMS integration
  - Escalation warnings
  - SLA monitoring

### System Intelligence

- **🧠 AI-Powered Classification**
  - Gemini API integration
  - Multi-language support
  - Context-aware categorization
  - Sentiment analysis

- **⚡ Auto-Prioritization Engine**
  - Time-based escalation
  - Severity assessment
  - Public impact evaluation
  - Dynamic priority adjustment

- **🔄 Event-Driven Architecture**
  - Kafka message streaming
  - Real-time updates
  - Scalable processing
  - Reliable delivery

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|-----------|---------|
| ![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react) | UI Framework |
| ![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite) | Build Tool |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css) | Styling |
| ![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8) | Offline Support |

### Backend

| Technology | Purpose |
|-----------|---------|
| ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=spring-boot) | Application Framework |
| ![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql) | Primary Database |
| ![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?logo=redis) | Caching Layer |
| ![Kafka](https://img.shields.io/badge/Apache%20Kafka-3.x-231F20?logo=apache-kafka) | Event Streaming |

### AI & Integration

| Technology | Purpose |
|-----------|---------|
| ![Gemini](https://img.shields.io/badge/Gemini%20API-AI-4285F4?logo=google) | AI Classification |
| ![Geolocation](https://img.shields.io/badge/Geolocation-API-34A853) | Location Services |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React + Vite)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   PWA    │  │Tailwind  │  │ Geo API  │  │ UI/UX    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │ REST API / WebSocket
┌────────────────────────────┴────────────────────────────────┐
│                    Spring Boot Backend                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  REST    │  │ Security │  │ Business │  │ Scheduler│   │
│  │  API     │  │  Layer   │  │  Logic   │  │ Service  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────┬───────────────┬───────────────┬────────────────────┘
        │               │               │
   ┌────▼────┐     ┌───▼────┐     ┌───▼────┐
   │  MySQL  │     │ Redis  │     │ Kafka  │
   │ Database│     │ Cache  │     │ Events │
   └────┬────┘     └────────┘     └───┬────┘
        │                              │
        │         ┌────────────────────▼─────┐
        └────────►│   Gemini AI Service      │
                  │ (Issue Classification)    │
                  └──────────────────────────┘
```

---

## 📱 Screenshots

### Desktop View

<table>
  <tr>
    <td><img src="https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Home+Page" alt="Home Page"/></td>
    <td><img src="https://via.placeholder.com/400x300/10B981/FFFFFF?text=Report+Issue" alt="Report Issue"/></td>
  </tr>
  <tr>
    <td align="center"><b>Home Page</b></td>
    <td align="center"><b>Report Issue</b></td>
  </tr>
  <tr>
    <td><img src="https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Dashboard" alt="Dashboard"/></td>
    <td><img src="https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Issue+Tracking" alt="Issue Tracking"/></td>
  </tr>
  <tr>
    <td align="center"><b>Admin Dashboard</b></td>
    <td align="center"><b>Issue Tracking</b></td>
  </tr>
</table>

### Mobile View

<table>
  <tr>
    <td><img src="https://via.placeholder.com/250x450/6366F1/FFFFFF?text=Mobile+Home" alt="Mobile Home"/></td>
    <td><img src="https://via.placeholder.com/250x450/8B5CF6/FFFFFF?text=Mobile+Report" alt="Mobile Report"/></td>
    <td><img src="https://via.placeholder.com/250x450/EC4899/FFFFFF?text=Mobile+Track" alt="Mobile Track"/></td>
  </tr>
  <tr>
    <td align="center"><b>Mobile Home</b></td>
    <td align="center"><b>Report Form</b></td>
    <td align="center"><b>Track Issues</b></td>
  </tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18+)
- **Java** (JDK 17+)
- **Maven** (3.8+)
- **MySQL** (8.0+)
- **Redis** (7.0+)
- **Apache Kafka** (3.0+)
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Akash-Adak/TrustLine.git
cd TrustLine
```

#### 2. Backend Setup

```bash
cd backend

# Configure application.properties
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Update with your credentials:
# - Database credentials
# - Redis configuration
# - Kafka broker details
# - Gemini API key

# Build the application
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start at `http://localhost:8080`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Update with your settings:
# - VITE_API_BASE_URL=http://localhost:8080
# - VITE_GEMINI_API_KEY=your_api_key

# Start development server
npm run dev
```

The frontend will start at `http://localhost:5173`

#### 4. Database Setup

```bash
# Create database
mysql -u root -p

CREATE DATABASE trustline;
USE trustline;

# Run migrations (Spring Boot will auto-create tables)
# Or import schema if provided
source database/schema.sql
```

#### 5. Start Supporting Services

```bash
# Start Redis
redis-server

# Start Kafka & Zookeeper
# Windows
bin\windows\zookeeper-server-start.bat config\zookeeper.properties
bin\windows\kafka-server-start.bat config\server.properties

# Linux/Mac
bin/zookeeper-server-start.sh config/zookeeper.properties
bin/kafka-server-start.sh config/server.properties
```

---

## ⚙️ Configuration

### Backend Configuration (`application.properties`)

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/trustline
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# Redis Configuration
spring.redis.host=localhost
spring.redis.port=6379

# Kafka Configuration
spring.kafka.bootstrap-servers=localhost:9092
spring.kafka.consumer.group-id=trustline-group

# Gemini AI Configuration
gemini.api.key=your_gemini_api_key
gemini.api.url=https://generativelanguage.googleapis.com/v1/models

# Auto-Prioritization Settings
issue.escalation.days=7
issue.auto-priority.enabled=true
```

### Frontend Configuration (`.env`)

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
VITE_APP_NAME=TrustLine
VITE_PWA_ENABLED=true
```

---

## 📚 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "SecurePass123!"
}
```

### Issue Reporting

#### Create Issue
```http
POST /api/issues
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "category": "CIVIC",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "images": ["base64_encoded_image"]
}
```

#### Get All Issues
```http
GET /api/issues?page=0&size=10&sort=priority,desc
Authorization: Bearer {token}
```

#### Update Issue Status (Admin)
```http
PATCH /api/issues/{issueId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "remarks": "Team assigned to fix the issue"
}
```

### Analytics

#### Get Dashboard Stats
```http
GET /api/analytics/dashboard
Authorization: Bearer {token}
```

#### Get Issue Heatmap
```http
GET /api/analytics/heatmap?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {token}
```

For complete API documentation, visit: `http://localhost:8080/swagger-ui.html`

---

## 📴 PWA Features

TrustLine is a Progressive Web App with:

- ✅ **Offline Functionality**: Access reported issues without internet
- ✅ **Install to Home Screen**: Native app-like experience
- ✅ **Push Notifications**: Real-time updates on issue status
- ✅ **Background Sync**: Sync reports when connection restored
- ✅ **Responsive Design**: Adapts to any screen size

### Installing the PWA

1. Open TrustLine in Chrome/Edge
2. Click the install icon in the address bar
3. Follow the prompts to add to home screen

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Code Style Guidelines

- **Java**: Follow Google Java Style Guide
- **JavaScript/React**: Use ESLint and Prettier
- **Commit Messages**: Use conventional commits format

---

## 🔐 Security

- All API endpoints are secured with JWT authentication
- Passwords are hashed using BCrypt
- Input validation and sanitization
- CORS configuration for secure cross-origin requests
- Rate limiting on sensitive endpoints

Report security vulnerabilities to: [security@trustline.gov]

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Project Maintainer**: Akash Adak

- GitHub: [@Akash-Adak](https://github.com/Akash-Adak)
- Email: contact@trustline.gov
- Website: [trustline.gov]((https://trust-line.vercel.app/))

---

## 🙏 Acknowledgments

- Gemini AI for intelligent issue classification
- Spring Boot community for excellent framework
- React and Vite teams for modern frontend tooling
- Apache Kafka for reliable event streaming
- All contributors who help improve TrustLine

---

<div align="center">

**Made with ❤️ for better civic engagement**

⭐ Star this repository if you find it helpful!

[Report Bug](https://github.com/Akash-Adak/TrustLine/issues) • [Request Feature](https://github.com/Akash-Adak/TrustLine/issues)

</div>
