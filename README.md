# AI-Powered Academic Plagiarism Detection System

Full-stack application for faculty to detect plagiarism in student programming assignments using **text similarity (TF-IDF)**, **metadata analysis**, and **AST structural similarity** via the **Zhang-Shasha tree edit distance** algorithm.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React (Vite), React Router, Axios, Tailwind CSS, Recharts, React Icons |
| Backend | FastAPI, Pydantic, Motor, Scikit-Learn, zss, Uvicorn |
| Database | MongoDB (`mongodb://localhost:27017`, database: `plagiarism_detection`) |

## Project Structure

```
plagiarism-detection-system/
├── backend/
│   ├── app/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # AST, similarity, risk engines
│   │   ├── schemas/
│   │   ├── database/
│   │   └── main.py
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/
        ├── components/
        ├── services/
        └── context/
```

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **MongoDB** running locally on port `27017`

## Setup Instructions

### 1. MongoDB

Start MongoDB (Windows service, Compass, or Docker):

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Connection: `mongodb://localhost:27017`  
Database name: `plagiarism_detection` (created automatically)

### 2. Backend

```bash
cd plagiarism-detection-system/backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

### 3. Frontend

```bash
cd plagiarism-detection-system/frontend
npm install
npm run dev
```

App: http://localhost:5173

Optional `.env` in `frontend/`:

```
VITE_API_URL=http://localhost:8000
```

## Default Faculty Login

| Field | Value |
|-------|-------|
| Email | `faculty@university.edu` |
| Password | `faculty123` |

Seeded automatically on first API startup.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Faculty JWT login |
| POST | `/submissions` | Create submission |
| GET | `/submissions` | List/search submissions |
| GET | `/submissions/{id}` | Get submission |
| DELETE | `/submissions/{id}` | Delete submission |
| POST | `/compare` | Compare two submissions |
| GET | `/analytics` | Dashboard metrics |
| POST | `/review` | Submit faculty review |
| GET | `/review/{submission_id}` | Review history |

## Plagiarism Detection Pipeline

1. **Text Similarity (40%)** — TF-IDF char n-grams + cosine similarity  
2. **AST Structural Similarity (50%)** — Parse → normalize names → Zhang-Shasha distance  
3. **Metadata Similarity (10%)** — Assignment, language, submission time proximity  

**Final Risk** = `Text×0.40 + AST×0.50 + Metadata×0.10`

| Score | Level |
|-------|-------|
| 0–40 | Low Risk |
| 41–70 | Medium Risk |
| 71–100 | High Risk |

## Testing Plagiarism Detection

Create two Python submissions with the same logic but different variable names:

**Student A:**
```python
for i in range(10):
    print(i)
```

**Student B:**
```python
for x in range(10):
    print(x)
```

Run **Compare** or **Structural Analysis** — AST similarity should remain high after normalization.

## Features

- Faculty JWT authentication with protected routes  
- Submission CRUD, search, file upload  
- Dashboard with Recharts (risk pie, language bar, trends)  
- Side-by-side comparison with highlighted matching lines  
- Expandable AST tree visualization  
- Faculty review workflow (genuine / suspicious / confirmed)  
- Dark mode support  

## Production Notes

- Change `jwt_secret` in `backend/app/config.py` or via `.env`
- Use HTTPS and secure CORS origins
- AST analysis currently supports **Python** submissions

## License

MIT — Academic use.
