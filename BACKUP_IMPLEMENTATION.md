# 🔒 Database Backup & PostgreSQL Implementation

## ✅ Implemented Features

### 1. **Automated Backup System**

- ✅ API endpoints for backup/restore operations
- ✅ Automatic backup cleanup (keeps last 30 backups)
- ✅ Support for both SQLite and PostgreSQL
- ✅ Backup metadata tracking
- ✅ Pre-restore safety backups

### 2. **PostgreSQL Support**

- ✅ PostgreSQL container running (crypto-portfolio-postgres)
- ✅ Switchable database backend (SQLite ↔ PostgreSQL)
- ✅ Automatic connection pooling
- ✅ Health checks enabled

### 3. **Persistent Volumes**

- ✅ `backend_data` - Application data (SQLite DB)
- ✅ `postgres_data` - PostgreSQL data
- ✅ `backup_data` - Automated backups storage

---

## 📡 API Endpoints

All backup endpoints are available at `http://localhost:8000/api/backup/`

### **1. Create Backup**

```http
POST /api/backup/create
Authorization: Bearer <your_token>

{
  "backup_name": "optional_custom_name"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Backup created successfully",
  "data": {
    "backup_file": "/app/backups/backup_20260112_143022.db",
    "size_mb": 0.25,
    "timestamp": "20260112_143022"
  }
}
```

### **2. List Backups**

```http
GET /api/backup/list
Authorization: Bearer <your_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Found 5 backup(s)",
  "data": {
    "backups": [
      {
        "filename": "backup_20260112_143022.db",
        "size_mb": 0.25,
        "created_at": "2026-01-12T14:30:22"
      }
    ],
    "count": 5
  }
}
```

### **3. Restore Backup**

```http
POST /api/backup/restore
Authorization: Bearer <your_token>

{
  "backup_file": "backup_20260112_143022.db"
}
```

### **4. Delete Backup**

```http
DELETE /api/backup/delete/{backup_file}
Authorization: Bearer <your_token>
```

### **5. Auto Cleanup**

```http
POST /api/backup/cleanup
Authorization: Bearer <your_token>

{
  "keep_last_n": 30
}
```

### **6. Database Info**

```http
GET /api/backup/info
Authorization: Bearer <your_token>
```

### **7. Auto Daily Backup**

```http
POST /api/backup/auto-backup
Authorization: Bearer <your_token>
```

---

## 🔄 Switching Between SQLite and PostgreSQL

### **Currently Using:** SQLite (Default)

### **To Switch to PostgreSQL:**

1. **Stop containers:**

   ```powershell
   docker-compose down
   ```

2. **Edit docker-compose.yml:**

   ```yaml
   services:
     backend:
       environment:
         # Comment out SQLite
         # - DATABASE_URL=sqlite:///./data/crypto_portfolio.db
         # Uncomment PostgreSQL
         - DATABASE_URL=postgresql://crypto_user:crypto_password@postgres:5432/crypto_portfolio
   ```

3. **Start containers:**

   ```powershell
   docker-compose up -d
   ```

4. **Initialize PostgreSQL database:**

   ```powershell
   docker exec crypto-portfolio-app-backend-1 python -c "from app.database import create_all_tables; create_all_tables()"
   ```

5. **Verify:**
   ```powershell
   curl http://localhost:8000/api/backup/info
   ```

### **To Switch Back to SQLite:**

1. Stop containers
2. Uncomment SQLite URL in docker-compose.yml
3. Comment out PostgreSQL URL
4. Start containers

---

## 💾 Backup Strategies

### **Strategy 1: Manual Backup (Via API)**

```bash
# Using curl
curl -X POST http://localhost:8000/api/backup/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"backup_name": "manual_backup"}'
```

### **Strategy 2: Scheduled Backups**

**Using Windows Task Scheduler:**

1. Create a PowerShell script:

```powershell
# backup-script.ps1
$token = "YOUR_AUTH_TOKEN"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Method Post `
    -Uri "http://localhost:8000/api/backup/auto-backup" `
    -Headers $headers
```

2. Schedule in Task Scheduler:
   - Open Task Scheduler
   - Create Basic Task
   - Trigger: Daily at 2:00 AM
   - Action: Start a program
   - Program: `powershell.exe`
   - Arguments: `-File "C:\path\to\backup-script.ps1"`

**Using Cron (Linux/Mac):**

```cron
0 2 * * * curl -X POST http://localhost:8000/api/backup/auto-backup \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Strategy 3: Backup on Application Start**

Add to your application startup script:

```powershell
# Before starting app
curl -X POST http://localhost:8000/api/backup/create \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Backup File Locations

### **Inside Docker Container:**

- SQLite Backups: `/app/backups/*.db`
- PostgreSQL Backups: `/app/backups/*.sql`
- Metadata: `/app/backups/*_metadata.json`

### **On Host Machine (via Volume):**

```powershell
# View volume location
docker volume inspect crypto-portfolio-app_backup_data

# Copy backup to host
docker cp crypto-portfolio-app-backend-1:/app/backups ./local-backups
```

---

## 🛡️ Best Practices

### **1. Regular Backups**

- **Daily**: Automatic backups via API
- **Weekly**: Manual verification backup
- **Before Updates**: Manual backup

### **2. Off-site Backup**

```powershell
# Copy backups to cloud storage
docker cp crypto-portfolio-app-backend-1:/app/backups E:\OneDrive\CryptoBackups
```

### **3. Test Restores**

```powershell
# Quarterly - test restore process
curl -X POST http://localhost:8000/api/backup/restore \
  -H "Authorization: Bearer TOKEN" \
  -d '{"backup_file": "test_backup.db"}'
```

### **4. Monitor Backup Size**

```powershell
# Check backup volume usage
docker system df -v
```

---

## 🚀 PostgreSQL Advantages

| Feature          | SQLite               | PostgreSQL                |
| ---------------- | -------------------- | ------------------------- |
| Concurrent Users | Limited              | Excellent                 |
| Data Size        | < 1 GB               | Unlimited                 |
| Backup Tools     | File Copy            | pg_dump/pg_restore        |
| ACID Compliance  | Good                 | Excellent                 |
| Performance      | Good for single user | Better for multiple users |
| Production Ready | Dev/Small Apps       | Production Apps           |

---

## 📈 Migration Path

### **From SQLite to PostgreSQL (Without Data Loss):**

1. **Backup current SQLite database:**

   ```bash
   curl -X POST http://localhost:8000/api/backup/create \
     -H "Authorization: Bearer TOKEN" \
     -d '{"backup_name": "pre_migration"}'
   ```

2. **Export data (manual):**

   ```powershell
   # You'll need to write a migration script or use a tool like pgloader
   # For now, starting fresh with PostgreSQL is recommended
   ```

3. **Switch to PostgreSQL** (see instructions above)

4. **Re-import data or start fresh**

---

## 🔍 Monitoring

### **Check Database Type:**

```bash
curl http://localhost:8000/api/backup/info \
  -H "Authorization: Bearer TOKEN"
```

### **Check Backup Count:**

```bash
curl http://localhost:8000/api/backup/list \
  -H "Authorization: Bearer TOKEN"
```

### **Container Health:**

```powershell
docker ps
docker logs crypto-portfolio-postgres
docker logs crypto-portfolio-app-backend-1
```

---

## ⚡ Quick Commands

```powershell
# Create backup
curl -X POST http://localhost:8000/api/backup/create -H "Authorization: Bearer TOKEN"

# List backups
curl http://localhost:8000/api/backup/list -H "Authorization: Bearer TOKEN"

# Check database info
curl http://localhost:8000/api/backup/info -H "Authorization: Bearer TOKEN"

# View all volumes
docker volume ls

# Check container status
docker ps

# View PostgreSQL logs
docker logs crypto-portfolio-postgres

# Access PostgreSQL directly
docker exec -it crypto-portfolio-postgres psql -U crypto_user -d crypto_portfolio
```

---

## 🎯 Summary

You now have:

1. ✅ **Automated Backup System** - API-based backup/restore
2. ✅ **PostgreSQL Ready** - Production-grade database available
3. ✅ **Persistent Storage** - All data survives restarts
4. ✅ **Flexible Configuration** - Switch between SQLite/PostgreSQL
5. ✅ **API Documentation** - Available at http://localhost:8000/docs

**Current Status:**

- Database: SQLite (can switch to PostgreSQL anytime)
- Backups: Automated with API
- Persistence: Guaranteed via Docker volumes

Your data is now **bulletproof**! 🔒
