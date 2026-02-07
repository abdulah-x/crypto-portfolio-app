# 🚀 VaultX - Crypto Portfolio Tracker

Full-stack cryptocurrency portfolio management platform with real-time tracking, advanced analytics, and Binance integration.

## ✨ Features

- **Portfolio Tracking**: Real-time multi-asset portfolio monitoring with live P&L calculations
- **Security**: JWT authentication with token management and secure password hashing
- **Binance Integration**: Testnet support for safe portfolio synchronization
- **Analytics**: Advanced P&L analysis with multiple calculation methods (FIFO, portfolio-based)
- **Modern UI**: Responsive Next.js dashboard with dark theme and real-time charts
- **API**: 50+ REST endpoints with complete OpenAPI documentation

## 📁 **Project Structure**

```
crypto-portfolio-app/
├── frontend/                   # Next.js Frontend Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx     # Root layout with fonts & theming
│   │   │   ├── page.tsx       # Landing page with portfolio showcase
│   │   │   ├── login/         # Login page with validation
│   │   │   ├── signup/        # Signup page with advanced validation
│   │   │   └── globals.css    # Global styles and TailwindCSS
│   │   └── components/        # Reusable React components
│   ├── tailwind.config.ts     # TailwindCSS configuration
│   ├── package.json          # Frontend dependencies
│   └── next.config.js        # Next.js configuration
├── backend/                   # FastAPI Backend
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── core/             # Authentication & security
│   │   ├── database/         # Models & migrations
│   │   └── services/         # Business logic
│   ├── requirements.txt      # Python dependencies
│   └── main.py              # FastAPI application
├── docker-compose.yml        # Development environment
└── README.md                # This file
```

## 🏗️ **Architecture**

### **Tech Stack**
- **Frontend**: Next.js 15.5.4 with TypeScript
- **Styling**: TailwindCSS with modern design system
- **Fonts**: Inter & JetBrains Mono (Google Fonts)
- **Backend**: FastAPI (Python 3.11+)
- **Database**: SQLite with SQLAlchemy ORM
- *🏗️ Tech Stack

**Frontend**: Next.js 15.5.4 • TypeScript • TailwindCSS • Recharts  
**Backend**: FastAPI • Python 3.11 • SQLAlchemy • PostgreSQL  
**Auth**: JWT • bcrypt  
**APIs**: Binance Testnet • Email (Gmail SMTP)
- **Backend API Docs**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

## 🎨 **Frontend Features**

### **✨ Modern Design System**
- **Professional Typography**: Inter & JetBrains Mono fonts with display swap optimization
- **ReQuick Start

### Using Docker Compose (Recommended)
```bash
# Clone repository
git clone https://github.com/abdulah-x/crypto-portfolio-app.git
cd crypto-portfolio-app

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# Start all services
docker-compose up -d

# Initialize database
docker exec VaultX-backend python manage_db.py
```

**Access**:
- Frontend: http://localhost:3100
- Backend API: http://localhost:8001/docs

### Manual Setup
```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env
python manage_db.py
uvicorn app.main:app --host 0.0.0.0 --port 8001

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## 📝 Configuration

Create `backend/.env`:
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/vaultx

# JWT
SECRET_KEY=your-secret-key-change-this
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Optional: Binance Testnet
BINANCE_API_KEY=your-testnet-key
BINANCE_SECRET_KEY=your-testnet-secret
```

## 🔑 Key Endpoints

- `POST /api/auth/register` - User registration with email verification
- `POST /api/auth/login` - Login with JWT token
- `GET /api/portfolio/summary` - Portfolio overview with P&L
- `GET /api/portfolio/holdings` - Detailed holdings breakdown
- `POST /api/binance/sync` - Sync portfolio from Binance
- Full API docs at `/docs`

## 📄 License

MIT License

---

**Built with ❤️ for crypto traders