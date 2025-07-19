# BrainBytes Monitoring System - Visual Architecture

## Simple Integration Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    BrainBytes Application                    │
├─────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────────┐          ┌─────────────────┐          │
│  │   Frontend      │          │   Backend       │          │
│  │   (React)       │◄────────►│   (Node.js)     │          │
│  │   Port: 3001    │          │   Port: 8080    │          │
│  └─────────────────┘          └─────────────────┘          │
│                                        │                   │
│                                        │                   │
│                                        ▼                   │
│                               ┌─────────────────┐          │
│                               │   /metrics      │          │
│                               │   endpoint      │          │
│                               │                 │          │
│                               │  • prom-client  │          │
│                               │  • Custom       │          │
│                               │    Metrics      │          │
│                               └─────────────────┘          │
└─────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTP Scraping
                                        │ (Every 15s)
                                        ▼
┌─────────────────────────────────────────────────────────────┐
│                Prometheus Monitoring                        │
├─────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────────┐          ┌─────────────────┐          │
│  │   Prometheus    │          │   Grafana       │          │
│  │   Port: 9090    │◄────────►│   Port: 3001    │          │
│  │                 │          │                 │          │
│  │  • Scrapes      │          │  • Dashboards   │          │
│  │    Metrics      │          │  • Visualizes   │          │
│  │  • Stores       │          │    Data         │          │
│  │    Data         │          │                 │          │
│  └─────────────────┘          └─────────────────┘          │
│           │                                                │
│           │                                                │
│           ▼                                                │
│  ┌─────────────────┐                                       │
│  │  Alertmanager   │                                       │
│  │  Port: 9093     │                                       │
│  │                 │                                       │
│  │  • Processes    │                                       │
│  │    Alerts       │                                       │
│  │  • Sends        │                                       │
│  │    Notifications│                                       │
│  └─────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
```

## Component Roles

### Application Layer
- **Frontend**: User interface for chat and learning
- **Backend**: API server with integrated metrics export
- **Metrics Endpoint**: `/metrics` exposes Prometheus-format metrics

### Monitoring Layer
- **Prometheus**: Scrapes metrics, stores time-series data
- **Grafana**: Creates dashboards and visualizations
- **Alertmanager**: Handles alert notifications

## Data Flow

1. **User Interaction** → Backend processes requests
2. **Metrics Generation** → prom-client library tracks operations
3. **Metrics Export** → `/metrics` endpoint exposes data
4. **Scraping** → Prometheus fetches metrics every 15s
5. **Storage** → Time-series database stores historical data
6. **Visualization** → Grafana displays real-time dashboards
7. **Alerting** → Alertmanager processes and sends notifications
