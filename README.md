# NotedAI

<div align="center">
  <h3>AI-Powered Meeting and Task Management Platform</h3>
</div>

## Overview

NotedAI is a sophisticated productivity application that combines AI-powered note-taking, meeting management, and task organization into a seamless platform for professionals. It leverages advanced AI capabilities to streamline workflows, extract insights from meetings, and help users manage their tasks efficiently.

## Features

### AI Meeting Assistant
- **Smart Summaries**: Automatically generate concise meeting summaries from your notes
- **Action Item Extraction**: AI identifies and organizes action items from meeting content
- **Natural Language Q&A**: Ask questions about your meeting notes and get instant answers

### Task Management
- **Intelligent Organization**: Create, prioritize, and categorize tasks with smart tags
- **AI Suggestions**: Get recommendations for organizing and prioritizing your workload
- **Custom Filters**: Quickly find the tasks that matter most with robust filtering options

### Calendar Integration
- **Google Calendar Support**: Seamlessly connect with your Google Calendar
- **Event Management**: Create, update, and track events in a beautiful interface
- **Scheduling Assistance**: AI helps find optimal meeting times based on your availability

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **AI Integration**: CopilotKit, Google Gemini AI, Groq
- **Authentication**: Appwrite
- **Calendar**: FullCalendar with Google Calendar integration
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Appwrite account for authentication
- Google API Key for Gemini AI and Calendar integration

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/NotedAI.git
   cd NotedAI
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   GOOGLE_API_KEY=your_google_api_key
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open http://localhost:3000 in your browser to see the application.

## Project Structure

```
src/
├── app/               # Next.js app router pages and layouts
│   ├── api/           # API routes for AI functionality
│   ├── dashboard/     # Dashboard interface
│   ├── meeting/       # Meeting management
│   ├── tasks/         # Task management
│   └── (auth)/        # Authentication routes
├── components/        # React components
│   ├── ui/            # UI components (buttons, cards, etc.)
│   ├── calendar/      # Calendar components
│   └── context/       # Context providers
├── lib/               # Utility libraries
│   ├── appwrite.ts    # Appwrite client configuration
│   └── utils.ts       # General utilities
└── hooks/             # Custom React hooks
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_API_KEY` | Google API key for Gemini AI integration |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Your Appwrite project ID |
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Appwrite API endpoint |
| `NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY` | Google API key with Calendar permissions |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Acknowledgments

* Next.js for the React framework
* Tailwind CSS for styling
* shadcn/ui for UI components
* Appwrite for authentication
* Google Gemini AI for AI capabilities
* FullCalendar for calendar functionality
* CopilotKit for AI assistant integration