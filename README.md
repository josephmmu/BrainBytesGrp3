# BrainBytes AI Tutoring Platform

## Project Overview
BrainBytes is an AI-powered tutoring platform designed to provide accessible academic assistance to Filipino students. This project implements the platform using modern DevOps practices and containerization.

## Team Members
- Joseph Sales - Team Lead - [lr.jsales@mmdc.mcl.edu.ph]
- Reinard Ezekiel Rivera / Francis John Alintano - Backend Developer - [lr.rerivera@mmdc.mcl.edu.ph / lr.fjalintano@mmdc.mcl.edu.ph]
- Keanne Wesley Eucogco - Frontend Developer - [lr.kweucogco@mmdc.mcl.edu.ph]
- John Clyde Austria - DevOps Engineer - [lr.jcaustria@mmdc.mcl.edu.ph]

## Project Goals
- Implement a containerized application with proper networking
- Create an automated CI/CD pipeline using GitHub Actions
- Deploy the application to Oracle Cloud Free Tier
- Set up monitoring and observability tools

## Technology Stack
- Frontend: Next.js
- Backend: Node.js
- Database: MongoDB Atlas
- Containerization: Docker
- CI/CD: GitHub Actions
- Cloud Provider: Oracle Cloud Free Tier
- Monitoring: Prometheus & Grafana


## How to use the Tutoring Platform

Link:

1. Launch the platformby clicking the link above, it should bring you directly to the platform
2. Type in any topic or question of your choice for th platform to answer.
Note: It can answer school related questions, some may vary
3. Once you input your question, the platform will automatically find the answer to your question based on the information it gathered.



# Development Environment Setup Verification

| Team Member    | Docker Installed  | Git Installed| VS Code Installed   | Can Run Hello World Container     |
|----------------|-------------------|--------------|---------------------|-----------------------------------|
| [Joseph Sales]         | ✓                 | ✓           | ✓                   | ✓                                |
| [John Clyde Austria]         | ✓                 | ✓           | ✓                   | ✓                                |
| [Reinard Ezekiel Rivera]         | ✓                 | ✓           | ✓                   | ✓                                |
| [Francis John Alintano]         | ✓                 | ✓           | ✓                   | ✓                                |
| [Keanne Wesley Eucogco]         | ✓                 | ✓           | ✓                   | ✓                                |


## Docker Version Information



Sample Architecture (Initial)

![BrainBytes Container Diagram drawio](https://github.com/user-attachments/assets/2acaf8d7-5e71-4b90-8042-f574fefad649)

Your diagram should be slightly more detailed and include:
Container names
Port mappings
Data flows
Any additional services (like the AI model integration)


Task Distribution Plan


# Milestone 1 Task Distribution

Week 1: Container Basics

**Joseph Sales**: Set up project repository and basic documentation.

**Joseph Sales**: Research and document containerization approach.

**All Team Members**: Complete Docker installation and verification.


Week 2: Platform Development

**Keanne Wesley Eucogco**: Implement frontend container (Next.js).

**Reinard Ezekiel Rivera / Francis John Alintano**: Implement backend container (Node.js).

**Joseph Sales**: Configure MongoDB Atlas and connection.


Week 3: Platform Development (continued)

**Keanne Wesley Eucogco**: Implement chat interface frontend.

**Reinard Ezekiel Rivera / Francis John Alintano**: Implement backend API endpoints.

**John Clyde Austria**: Set up container networking.


Week 4: Integration and Testing

**Joseph Sales**: Integrate AI model.

**Joseph Sales**: Implement message history storage.

**Joseph Sales**: Create project documentation.

**All Team Members**: Final testing and preparation for submission.
