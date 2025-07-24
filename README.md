# BrainBytes AI Tutoring Platform

## Project Overview
BrainBytes is an AI-powered tutoring platform designed to provide accessible academic assistance to Filipino students. This project implements the platform using modern DevOps practices, containerization, and comprehensive monitoring solutions.

## Team Members
- **Joseph Sales** - Team Lead - [lr.jsales@mmdc.mcl.edu.ph]
- **Reinard Ezekiel Rivera / Francis John Alintano** - Backend Developer - [lr.rerivera@mmdc.mcl.edu.ph / lr.fjalintano@mmdc.mcl.edu.ph]
- **Keanne Wesley Eucogco** - Frontend Developer - [lr.kweucogco@mmdc.mcl.edu.ph]
- **John Clyde Austria** - DevOps Engineer - [lr.jcaustria@mmdc.mcl.edu.ph]

## Project Goals
- ✅ Implement a containerized application with proper networking
- ✅ Create an automated CI/CD pipeline using GitHub Actions
- ✅ Deploy the application to cloud infrastructure
- ✅ Set up comprehensive monitoring and observability tools
- ✅ Implement AI-powered tutoring capabilities
- ✅ Ensure scalable, production-ready architecture

## Technology Stack

### **Frontend**
- **Framework**: Next.js 15.3.3
- **Language**: JavaScript/React
- **Styling**: CSS Modules
- **Container**: Docker

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript (ES6+)
- **Container**: Docker

### **Database**
- **Primary**: MongoDB Atlas
- **Local Development**: MongoDB (Containerized)

### **DevOps & Infrastructure**
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud Provider**: Railway (Production)
- **Monitoring**: Prometheus & Grafana
- **Alerting**: Alertmanager
- **Container Metrics**: cAdvisor
- **System Metrics**: Node Exporter

### **AI Integration**
- **Primary**: Google Gemini API
- **Fallback**: Multiple AI service providers
- **Backup**: Intelligent static responses

## Live Platform Access
**Production URL**: https://brainbytesgrp3-frontend-production.up.railway.app/

### How to Use the Tutoring Platform:
1. **Launch**: Click the link above to access the platform
2. **Register/Login**: Create an account or sign in
3. **Select Subject**: Choose from Science, Mathematics, History, or English
4. **Ask Questions**: Type any educational question
5. **Get Answers**: Receive detailed, subject-specific responses
6. **Review History**: Access your previous conversations

**Sample Questions to Try:**
- "What is photosynthesis?" (Science)
- "How do you solve quadratic equations?" (Mathematics)
- "Explain the Industrial Revolution" (History)
- "What is a metaphor?" (English)

## Architecture Overview

### **Container Architecture**
Our application uses a microservices architecture with the following containers:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│   Port: 5173    │    │   Port: 8080    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌─────────────────────────────────────────────────────┐
         │             Monitoring Stack                        │
         │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
         │  │ Prometheus  │ │   Grafana   │ │ Alertmanager│   │
         │  │ Port: 9090  │ │ Port: 3002  │ │ Port: 9093  │   │
         │  └─────────────┘ └─────────────┘ └─────────────┘   │
         └─────────────────────────────────────────────────────┘
```

### **Key Features**
- **Microservices Architecture**: Separate containers for frontend, backend, database
- **AI Integration**: Multiple AI providers with intelligent fallback
- **Real-time Chat**: WebSocket-like real-time messaging
- **User Authentication**: JWT-based secure authentication
- **Message History**: Persistent conversation storage
- **Subject-Specific**: Tailored responses by academic subject
- **Responsive Design**: Mobile and desktop optimized

## Monitoring & Observability

### **Monitoring Stack**
- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **Alertmanager**: Alert routing and notifications
- **cAdvisor**: Container performance metrics
- **Node Exporter**: System-level metrics

### **Key Dashboards**
1. **Error Analysis Dashboard**: Real-time error detection and analysis
2. **Resource Optimization Dashboard**: Performance and resource utilization
3. **Business Analytics**: User engagement and educational metrics

### **Monitored Metrics**
- **Application Performance**: Response times, throughput, error rates
- **Infrastructure**: CPU, memory, network, disk usage
- **Business Metrics**: User sessions, subject popularity, AI response quality
- **Container Health**: Docker container performance and resource consumption

## CI/CD Pipeline

### **GitHub Actions Workflows**
1. **Super Linter**: Code quality and style enforcement
2. **Docker Build**: Automated container image building
3. **BrainBytes CI/CD**: Comprehensive testing and deployment pipeline

### **Pipeline Features**
- **Automated Testing**: Jest unit tests for frontend and backend
- **Code Quality**: ESLint, security scanning
- **Container Building**: Multi-stage Docker builds
- **Deployment**: Automated deployment to production
- **Quality Gates**: Prevent faulty code from reaching production

## Development Journey

### **Milestone 1: Container Basics & Platform Development**

#### **Week 1: Foundation**
- ✅ Project repository setup and documentation
- ✅ Research and document containerization approach
- ✅ Complete Docker installation verification across all team members

#### **Week 2: Core Platform Development**
- ✅ Frontend container implementation (Next.js)
- ✅ Backend container implementation (Node.js)
- ✅ MongoDB Atlas configuration and connection

#### **Week 3: Feature Implementation**
- ✅ Chat interface frontend development
- ✅ Backend API endpoints implementation
- ✅ Container networking configuration

#### **Week 4: Integration & AI**
- ✅ AI model integration with multiple providers
- ✅ Message history storage implementation
- ✅ Comprehensive project documentation

### **Milestone 2: Advanced DevOps & Monitoring**

#### **Monitoring Implementation**
- ✅ Prometheus metrics collection setup
- ✅ Grafana dashboard creation and configuration
- ✅ Alertmanager notification system
- ✅ Custom metrics for educational platform
- ✅ Container and system monitoring

#### **CI/CD Pipeline**
- ✅ GitHub Actions workflow creation
- ✅ Automated testing pipeline
- ✅ Docker image building automation
- ✅ Quality gates and security scanning

#### **Production Deployment**
- ✅ Railway cloud deployment
- ✅ Production monitoring setup
- ✅ Performance optimization
- ✅ Scalability testing

### **Terminal Assessment: Production Readiness**

#### **Comprehensive Monitoring Demo**
- ✅ **Backend Monitoring**: Real-time API performance, database operations, AI service health
- ✅ **Frontend Monitoring**: User experience metrics, client-side performance, session tracking
- ✅ **Infrastructure Monitoring**: Container resources, system metrics, network performance

#### **CI/CD Demonstration**
- ✅ **Live Workflow Execution**: Manual GitHub Actions trigger
- ✅ **Automated Pipeline**: Code quality, testing, building, deployment
- ✅ **DevOps Best Practices**: Quality gates, automated testing, monitoring integration

#### **Technical Deep Dive**
- ✅ **Prometheus Architecture**: Service discovery, data collection, alerting
- ✅ **Container Monitoring**: Resource utilization, health checks, scaling decisions
- ✅ **Production Operations**: Incident response, performance optimization, reliability

## Final Presentation
**Presentation Video**: [Video demonstration of BrainBytes platform, monitoring systems, and CI/CD pipeline]

**Presentation Date**: July 24, 2025  
**Duration**: 15 minutes  
**Presenter**: Group 3

### Demonstration Coverage:
- ✅ BrainBytes AI Tutoring Platform Live Demo
- ✅ Comprehensive Monitoring with Grafana Dashboards
- ✅ GitHub Actions CI/CD Workflow Execution
- ✅ Technical Architecture Deep Dive
- ✅ Performance Metrics and Observability

### Technical Questions Addressed:
1. **Prometheus Data Loss Scenarios**: How the system handles container unavailability and recovery
2. **Grafana Container Monitoring**: Real-time performance tracking and alerting capabilities

## Development Environment Setup

### **Prerequisites**
- Docker & Docker Compose
- Node.js 18+
- Git
- VS Code (recommended)

### **Team Verification Status**
| Team Member | Docker | Git | VS Code | Hello World Container |
|-------------|--------|-----|---------|----------------------|
| Joseph Sales | ✓ | ✓ | ✓ | ✓ |
| John Clyde Austria | ✓ | ✓ | ✓ | ✓ |
| Reinard Ezekiel Rivera | ✓ | ✓ | ✓ | ✓ |
| Francis John Alintano | ✓ | ✓ | ✓ | ✓ |
| Keanne Wesley Eucogco | ✓ | ✓ | ✓ | ✓ |

### **Local Development Setup**
```bash
# Clone the repository
git clone https://github.com/josephmmu/BrainBytesGrp3.git
cd BrainBytesGrp3

# Start all services
docker-compose up -d

```

## Performance Metrics

### **Production Statistics**
- **Uptime**: 99.9% availability
- **Response Time**: <500ms average API response
- **Concurrent Users**: Supports 100+ simultaneous sessions
- **Error Rate**: <2% error rate maintained
- **AI Response Time**: <3 seconds average

### **Educational Impact**
- **Subjects Supported**: Science, Mathematics, History, English
- **Question Types**: Definitions, explanations, problem-solving, analysis
- **Response Quality**: Subject-specific, educationally accurate
- **User Engagement**: High retention through interactive learning

## Project Achievements

- ✅ **Full-Stack Development**: Complete educational platform
- ✅ **Production Deployment**: Live, accessible application
- ✅ **Enterprise Monitoring**: Comprehensive observability stack
- ✅ **DevOps Excellence**: Automated CI/CD pipeline
- ✅ **AI Integration**: Intelligent tutoring capabilities
- ✅ **Scalable Architecture**: Container-based microservices
- ✅ **Educational Value**: Real platform for student learning

## Support & Contact

For technical support or questions about the BrainBytes platform:
- **Team Lead**: Joseph Sales - lr.jsales@mmdc.mcl.edu.ph
- **DevOps Engineer**: John Clyde Austria - lr.jcaustria@mmdc.mcl.edu.ph
- **Repository**: https://github.com/josephmmu/BrainBytesGrp3

---

*BrainBytes - Empowering Filipino students through AI-powered education*
