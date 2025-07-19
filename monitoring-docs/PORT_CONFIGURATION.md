# BrainBytes Port Configuration

## ✅ **Updated Port Setup (July 2025)**

### **Application Services**
- **Frontend (Next.js)**: `http://localhost:3001`
  - *Note: Automatically moved to 3001 due to port 3000 conflict*
- **Backend (Node.js)**: `http://localhost:8080`
  - *Metrics endpoint*: `http://localhost:8080/metrics`

### **Monitoring Services**
- **Prometheus**: `http://localhost:9090`
  - *Metrics collection and storage*
- **Grafana**: `http://localhost:3002` 
  - *Dashboard and visualization*
  - *Credentials*: admin/admin123
- **Alertmanager**: `http://localhost:9093`
  - *Alert management and notifications*

### **Infrastructure Services**
- **Node Exporter**: `http://localhost:9100`
  - *System metrics collection*
- **cAdvisor**: `http://localhost:8081`
  - *Container metrics collection*

## 🔧 **Port Conflict Resolution**

### **Issue Fixed**
Previously, Grafana was configured to run on port 3001, which conflicted with the frontend when port 3000 was unavailable.

### **Solution Applied**
- **Frontend**: Runs on port 3001 (auto-assigned by Next.js)
- **Grafana**: Moved to port 3002 to avoid conflicts
- **All documentation updated** to reflect correct ports

## 🚀 **Quick Access Links**

```bash
# Application URLs
Frontend:     http://localhost:3001
Backend API:  http://localhost:8080
Metrics:      http://localhost:8080/metrics

# Monitoring URLs  
Prometheus:   http://localhost:9090
Grafana:      http://localhost:3002 (admin/admin123)
Alertmanager: http://localhost:9093

# Infrastructure URLs
Node Exporter: http://localhost:9100
cAdvisor:      http://localhost:8081
```

## 📋 **Start Commands**

```bash
# Start full monitoring stack
docker-compose -f docker-compose.monitoring.yml up -d

# Start development services
npm run dev  # Frontend (port 3001)
npm start    # Backend (port 8080)

# Run traffic simulation
cd monitoring-docs/simulation
node traffic-simulator.js
```

## 🔍 **Verification Commands**

```bash
# Check if services are running
curl http://localhost:3001     # Frontend
curl http://localhost:8080     # Backend  
curl http://localhost:8080/metrics  # Metrics
curl http://localhost:9090     # Prometheus
curl http://localhost:3002     # Grafana
curl http://localhost:9093     # Alertmanager
```

This configuration ensures no port conflicts and provides clear access to all monitoring and application services.
