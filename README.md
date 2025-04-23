# Blind Judge

![Blind Judge Logo](https://placehold.co/600x200?text=Blind+Judge)

> An AI-powered platform for impartial comparison of different perspectives on complex topics.

## Overview

Blind Judge is a web application that facilitates anonymous, unbiased comparison of conclusions drawn by different participants on the same topic. The system leverages AI to provide impartial analysis of differing viewpoints, helping users gain deeper understanding of complex issues.

## Features

- 🔒 **Private Discussion Rooms**: Create password-protected rooms with guiding questions
- 💬 **AI-Assisted Exploration**: Chat with AI to explore different perspectives on the topic
- 🧠 **Independent Conclusions**: Develop conclusions without being influenced by other participants
- ⚖️ **Impartial Analysis**: AI-powered comparison of different perspectives
- 📊 **Final Verdict**: Detailed analysis highlighting strengths of each viewpoint
- 🌓 **Dark/Light Mode**: Choose your preferred visual theme
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## How It Works

1. **Room Creation**: A user creates a discussion room with a guiding question and password
2. **Participant Joining**: Other participants join using the room ID and password
3. **Individual Exploration**: Each participant privately discusses the topic with an AI assistant
4. **Conclusion Submission**: Participants submit their final conclusions
5. **AI Comparison**: The system analyzes all conclusions impartially
6. **Results Presentation**: All participants receive detailed comparison and analysis

## Tech Stack

### Frontend
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Context API**: State management
- **CSS Variables**: Theming support
- **Axios**: API communication

### Backend
- **Node.js** & **Express.js**: Server framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB** & **Mongoose**: Database and ODM
- **JWT**: Authentication
- **OpenAI API**: AI-powered chat and comparison

## Architecture

Blind Judge follows a structured architecture pattern:

### Frontend Architecture
- **Components**: Reusable UI elements
- **Contexts**: Global state management
- **Hooks**: Custom React hooks for shared logic
- **Services**: API communication layer
- **Pages**: Full page components
- **Types**: TypeScript type definitions

### Backend Architecture
- **Routes Layer**: API endpoints and request routing
- **Controllers Layer**: Request processing and response management
- **Services Layer**: Business logic and operations
- **Repositories Layer**: Data access and storage
- **Models Layer**: Data structures and schemas

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

1. Clone the repositories:
   ```bash
   # Clone frontend repository
   git clone https://github.com/daniel-papkov/blindjudge.git

   # Clone backend repository
   git clone https://github.com/daniel-papkov/blindjudgeserver.git
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd blindjudgeserver
   npm install

   # Install frontend dependencies
   cd ../blindjudge
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Backend (.env in blindjudgeserver directory)
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/blind-judge
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   NODE_ENV=development

   # Frontend (.env in blindjudge directory)
   VITE_API_URL=http://localhost:3000/api
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd blindjudgeserver
   npm run dev

   # Start frontend server
   cd ../blindjudge
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Key Frontend Components

- **AuthProvider**: Manages authentication state
- **ChatInterface**: Handles AI conversation
- **CreateSession**: Room creation interface
- **JoinRoom**: Interface for joining existing rooms
- **MessageBubble**: Displays chat messages
- **PageNav**: Navigation and theme switching

## API Endpoints

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/signup`: User registration

### Rooms
- `POST /api/rooms`: Create new room
- `POST /api/rooms/:roomId/join`: Join existing room
- `GET /api/rooms/:roomId/status`: Get room status

### Chat
- `POST /api/rooms/:roomId/chat/init`: Initialize chat session
- `POST /api/rooms/:roomId/chat/message`: Send message
- `GET /api/rooms/:roomId/chat/history`: Get message history
- `POST /api/rooms/:roomId/chat/conclude`: Submit conclusion
- `POST /api/ai/:roomId/compare`: Generate comparison

## Project Structure

```
blindjudge/                   # Frontend repository
├── src/
│   ├── assets/               # Static assets
│   ├── components/           # React components
│   │   ├── auth/             # Authentication components
│   │   ├── chat/             # Chat components
│   │   ├── common/           # Shared components
│   │   ├── ErrorBboundary/   # Error component
│   │   └── room/             # Room components
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   ├── pages/                # Page components
│   ├── services/             # API services
│   ├── styles/               # Global CSS
│   ├── types/                # TypeScript types
│   └── App.tsx               # Main application
└── package.json

blindjudgeserver/             # Backend repository
├── src/
│   ├── config/               # Application configuration
│   ├── controllers/          # Request handlers
│   ├── errors/               # Error handling
│   ├── middleware/           # Express middleware
│   ├── models/               # Database models
│   ├── repositories/         # Data access layer
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── tests/                # Unit tests
│   ├── types/                # TypeScript types
│   ├── utils/                # Utility functions
│   └── server.ts             # Server entry point
└── package.json
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

Daniel Papkov - papkovdaniel1@gmail.com

## Project Links

- **Frontend**: [https://github.com/daniel-papkov/blindjudge](https://github.com/daniel-papkov/blindjudge)
- **Backend**: [https://github.com/daniel-papkov/blindjudgeserver](https://github.com/daniel-papkov/blindjudgeserver)

## Acknowledgements

- [OpenAI](https://openai.com) for providing the AI capabilities
- [Express.js](https://expressjs.com)
- [React](https://reactjs.org)
- [MongoDB](https://www.mongodb.com)
- [TypeScript](https://www.typescriptlang.org)
