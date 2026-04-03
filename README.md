# 🎬 Movie Recommendation Bot

*Automatically synced with your [v0.app](https://v0.app) deployments*

A modern, AI-inspired web application that provides personalized movie suggestions. This project focuses on delivering a seamless user experience with a "cinematic" dark-themed UI.

## 🚀 Features
- **Personalized Suggestions:** Recommends movies based on user-selected genres and moods.
- **Cinematic UI:** Built with a dark theme, elegant typography, and responsive design.
- **Interactive Interface:** Smooth transitions and hover effects for movie cards.
- **Mock API Integration:** Uses a structured API route to simulate real-time model interaction.

## 🛠️ Tech Stack
- **Frontend:** Next.js 14, React, Tailwind CSS
- **Styling:** Lucide React (Icons), Shadcn UI
- **Language:** TypeScript / JavaScript

## 📦 Installation & Setup

```bash
git clone https://github.com/K-NagaNehaSri/v0-movie-recommendation-bot.git
cd v0-movie-recommendation-bot
npm install
npm run dev
```


## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main recommendation page
│   └── api/
│       └── recommendations/
│           └── route.ts  # Mock API endpoint
├── components/           # Reusable React components
└── styles/              # Tailwind CSS styling
```

## 🔌 API Reference

- **Endpoint:** `GET /api/recommendations`
- **Query Parameters:**
  - `genres` - Comma-separated list of selected genres
  - `mood` - User's current mood preference
- **Response:** Array of movie objects with title, description, rating, and poster URL

## 🧠 Future Enhancements (AI/ML Roadmap)

As a CS student specializing in AI/ML, I plan to:
- Replace the mock API with a **Content-Based Filtering** model using Python (Flask/FastAPI).
- Implement **Collaborative Filtering** using the MovieLens dataset.
- Add a Natural Language Processing (NLP) chat interface to process queries like "Tell me a movie like Inception."

## 🚀 Deployment

Your project is live at: https://v0-movie-recommendation-bot-five.vercel.app/

## 📝 License

This project is open source and available under the MIT License.

## 💬 Contributing

Contributions are welcome! Feel free to fork this repository and submit a pull request with your improvements.

## 📧 Contact

For questions or suggestions, feel free to reach out:
- **GitHub:** [@K-NagaNehaSri](https://github.com/K-NagaNehaSri)
