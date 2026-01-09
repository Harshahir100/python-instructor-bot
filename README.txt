PYTHON INSTRUCTOR CHATBOT
=========================

This project is a Django-based AI chatbot application designed to behave as a
Python Instructor. It supports streaming responses, Markdown rendering,
Python code highlighting, chat history, and conversation management.

--------------------------------------------------
FEATURES
--------------------------------------------------
- Python-only AI Instructor
- Streaming (typing effect) responses
- Markdown support
- Python syntax highlighting
- Multiple chat conversations
- Auto-generated chat titles
- View full chat history
- Delete single chat or all chats
- Clean modern UI (ChatGPT-like)

--------------------------------------------------
TECH STACK
--------------------------------------------------
Backend:
- Python 3
- Django
- Groq API (LLM)
- SQLite (default)

Frontend:
- HTML
- CSS
- JavaScript


--------------------------------------------------
PROJECT STRUCTURE
--------------------------------------------------
chatbot/
├── migrations/
├── templates/
│   ├── index.html
│   ├── history_all.html
├── static/
│   ├── style.css
│   ├── chat.js
├── models.py
├── views.py
├── urls.py
└── admin.py

--------------------------------------------------
SETUP INSTRUCTIONS
--------------------------------------------------
1. Create virtual environment
   python -m venv venv
   venv\Scripts\activate   (Windows)
   source venv/bin/activate (Linux/Mac)

2. Install dependencies
   pip install django python-dotenv groq

3. Create .env file
   GROQ_API_KEY=your_api_key_here

4. Run migrations
   python manage.py makemigrations
   python manage.py migrate

5. Start server
   python manage.py runserver

6. Open browser
   http://127.0.0.1:8000/

--------------------------------------------------
USAGE
--------------------------------------------------
- Click "New Chat" to start a conversation
- Ask Python-related questions only
- Code responses are automatically highlighted
- Click "View History" to see all conversations
- Delete chats individually or all at once

--------------------------------------------------
IMPORTANT NOTES
--------------------------------------------------
- The AI answers ONLY Python-related questions
- Code is always wrapped in ```python blocks
- Streaming responses are saved after completion
- <title> tag appears in browser tab, not inside page

--------------------------------------------------
FUTURE IMPROVEMENTS
--------------------------------------------------
- User authentication
- Search chat history
- Export chats (PDF / Markdown)
- Copy code button
- Mobile sidebar toggle

--------------------------------------------------
AUTHOR
--------------------------------------------------
Developed by: Python Instructor Chatbot Project
Purpose: Learning & Interview Preparation

--------------------------------------------------
END
--------------------------------------------------
