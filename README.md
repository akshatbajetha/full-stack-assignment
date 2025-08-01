# Apify Integration Web Application

## Overview
A full-stack web application that integrates with the Apify platform to fetch actors, dynamically load their input schemas, and execute runs with user-provided inputs.

## Features
- Secure API key authentication
- Dynamic actor selection
- Runtime schema loading
- Real-time status monitoring
- Results display and export

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm

### Fork & Clone Repository
```bash
git clone https://github.com/akshatbajetha/full-stack-assignment.git
```


### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Run the application
- Visit http://locahost:5173 on your browser to use the application

## Testing Actor
I chose the **Instagram Scraper** actor for testing because:
- It has a comprehensive input schema
- Demonstrates URL array handling (startUrls)
- Provides meaningful results

## Design Choices

### Architecture
- **Backend**: Express.js with modular routes and services
- **Frontend**: React with functional components and hooks
- **Styling**: Tailwind CSS for clean, responsive design

### Security
- API keys sent via Bearer tokens in headers
- No keys stored in URLs or localStorage
- CORS properly configured

### User Experience
- Step-by-step flow: Auth → Select Actor → Fill Form → Execute → View Results
- Real-time status updates with polling
- Clear error messages and loading states
- Actor selector remains visible for easy switching

### Technical Decisions
- Dynamic form generation based on JSON Schema
- Special handling for URL object arrays (startUrls)
- Modular component architecture
- Comprehensive error handling

## Screenshots

|<img width="1920" height="912" alt="image" src="https://github.com/user-attachments/assets/47c752e7-92a3-4f8b-8e74-c876c2edd31e" /> | <img width="1920" height="912" alt="image" src="https://github.com/user-attachments/assets/b6e79ed8-29d9-46f5-841b-e2e25e7b9f73" /> |
| --- | --- |
| <img width="1920" height="912" alt="image" src="https://github.com/user-attachments/assets/2e557c5c-39c7-401a-9c82-ddfb2edf11dd" /> | <img width="1920" height="912" alt="image" src="https://github.com/user-attachments/assets/44be5e03-0e95-4d69-a436-52965fb979f8" /> |
| <img width="1920" height="912" alt="image" src="https://github.com/user-attachments/assets/137e2f78-5f30-4a9a-ad88-b17ef1ac2550" /> |



1. Authentication screen
2. Actor selection
3. Dynamic form with inputs
4. Execution in progress
5. Results display

## API Endpoints

### Backend Routes
- `POST /api/auth/validate` - Validate API key
- `GET /api/actors` - List user's actors
- `GET /api/actors/:actorId/input-schema` - Get actor schema
- `POST /api/actors/:actorId/run` - Execute actor
- `GET /api/actors/:actorId/runs/:runId/status` - Get run status
- `GET /api/actors/:actorId/runs/:runId/results` - Get run results

## Technologies Used
- **Backend**: Node.js, Express.js, Axios
- **Frontend**: React, Vite, Tailwind CSS
- **APIs**: Apify Platform API
