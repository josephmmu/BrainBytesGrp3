# BrainBytes Traffic Simulator

This directory contains a realistic traffic simulation system designed to generate test data for the BrainBytes monitoring system, with special focus on Filipino user patterns and mobile-first design.

## Overview

The traffic simulator creates realistic user interactions that mirror actual Filipino student behavior:
- **Mobile-first usage patterns** (70% mobile, 30% desktop)
- **Regional connectivity simulation** (Metro Manila, Cebu, Davao, provincial areas)
- **Connection type variations** (60% mobile data, 40% WiFi)
- **Filipino educational subjects** (Mathematics, Science, Filipino, etc.)
- **Realistic network delays** based on Philippines internet infrastructure

## Features

### 1. User Session Simulation
- Registers new users
- Performs login operations
- Sends multiple chat messages per session
- Simulates realistic session durations (1-5 minutes)

### 2. Filipino Context Integration
- Uses Filipino names and email addresses
- Includes Filipino and English educational questions
- Simulates popular mobile devices in Philippines
- Varies connection quality by region

### 3. Network Simulation
- Simulates different connection speeds
- Adds realistic network delays
- Varies performance by region and connection type

### 4. Comprehensive Metrics Generation
- HTTP request patterns
- User authentication flows
- Chat message exchanges
- AI response interactions
- Mobile vs desktop usage patterns

## Configuration

Environment variables:
- `BACKEND_URL`: Backend API URL (default: http://localhost:8080)
- `SIMULATION_DURATION`: Simulation duration in seconds (default: 300)
- `CONCURRENT_USERS`: Number of concurrent users (default: 10)

## Usage

### Standalone
```bash
cd monitoring-docs/simulation
npm install
npm start
```

### With Docker
```bash
docker build -t brainbytes-simulator .
docker run -e BACKEND_URL=http://backend:3000 brainbytes-simulator
```

### With Docker Compose
The simulator is automatically included in the main docker-compose.yml file.

## Sample Output

```
🎯 Starting BrainBytes Traffic Simulation...
📊 Configuration:
   - Backend URL: http://localhost:8080
   - Duration: 300 seconds
   - Concurrent Users: 10
   - Request Interval: 5000ms

🚀 Starting session for juan.delacruz@gmail.com (mobile, metro_manila, mobile_data)
✅ User registered: juan.delacruz@gmail.com (mobile, metro_manila)
💬 Message sent by juan.delacruz@gmail.com: "Paano ko masosolve ang quadratic equation?" (Mathematics)
💚 Backend Health: healthy (uptime: 156s)
🏁 Session ended for juan.delacruz@gmail.com

📈 Simulation Statistics:
========================
Total Requests: 245
Successful Requests: 230
Failed Requests: 15
Success Rate: 93.88%
Total Users: 10
Total Logins: 10
Total Messages: 67
========================
```

## Metrics Generated

The simulator generates data for all BrainBytes metrics:

1. **HTTP Metrics**: Request rates, response times, status codes
2. **User Activity**: Login patterns, session durations, device types
3. **Chat Activity**: Message rates, subject popularity, AI responses
4. **Filipino Context**: Mobile usage percentages, connection quality, regional patterns
5. **Educational Content**: Subject requests, learning material views

## Integration with Monitoring Stack

The simulator works seamlessly with the complete monitoring stack:
- **Prometheus**: Scrapes metrics from backend during simulation
- **Grafana**: Visualizes real-time simulation data
- **Alertmanager**: Tests alert rules with realistic load patterns

This enables comprehensive testing of the monitoring system with realistic Filipino user patterns.
