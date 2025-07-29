# NextStopTurkey - Local PostgreSQL Setup Guide

## 🚀 Quick Start

Bu proje artık tamamen local PostgreSQL ile çalışmaktadır. Supabase bağımlılığı kaldırılmıştır.

### Önkoşullar
- Docker ve Docker Compose
- Node.js 18+
- Git

### 1. Otomatik Kurulum (Önerilen)

```bash
# Tüm servisleri tek komutla başlatın
./start-dev.sh
```

Bu script otomatik olarak:
- PostgreSQL database'i başlatır
- Database migration'larını çalıştırır  
- Backend API'yi başlatır
- Frontend development server'ını başlatır

### 2. Manuel Kurulum

#### Adım 1: Database'i Başlatın
```bash
# PostgreSQL container'ını başlatın
docker-compose up -d postgres

# Database'in hazır olmasını bekleyin
docker exec tours-postgres pg_isready -U postgres
```

#### Adım 2: Backend'i Başlatın
```bash
cd backend

# Dependencies'leri yükleyin
npm install

# Migration'ları çalıştırın
npm run migrate

# Backend'i başlatın
npm run dev
```

#### Adım 3: Frontend'i Başlatın
```bash
# Ana dizine dönün
cd ..

# Dependencies'leri yükleyin
npm install

# Frontend'i başlatın
npm run dev
```

### 3. Docker ile Tam Kurulum

Tüm servisleri Docker container'larında çalıştırmak için:

```bash
# Tüm servisleri Docker ile başlatın
docker-compose up -d

# Logları takip edin
docker-compose logs -f
```

## 🔗 Servis URL'leri

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **PostgreSQL:** localhost:5432
  - Database: `tours_db`
  - Username: `postgres`
  - Password: `postgres123`

## 🛠️ Geliştirme Komutları

```bash
# Servisleri durdur
docker-compose down

# Database'i sıfırla
docker-compose down -v
docker-compose up -d postgres

# Migration'ları yeniden çalıştır
cd backend && npm run migrate

# Backend loglarını izle
docker-compose logs -f backend

# Frontend loglarını izle
docker-compose logs -f frontend
```

## 📊 Database Yönetimi

### pgAdmin ile Bağlantı
```
Host: localhost
Port: 5432
Database: tours_db
Username: postgres
Password: postgres123
```

### Doğrudan psql ile Bağlantı
```bash
docker exec -it tours-postgres psql -U postgres -d tours_db
```

## 🔧 Environment Variables

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=NextStopTurkey
```

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/tours_db
JWT_SECRET=your-secret-key
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## 📈 Performans İpuçları

1. **Database Indexing:** Production'da gerekli index'leri ekleyin
2. **Connection Pooling:** Backend'de PostgreSQL connection pool ayarları optimize edilmiştir
3. **Docker Volumes:** Database verisi kalıcı tutulmaktadır

## 🔒 Güvenlik Notları

- JWT secret'ı production'da mutlaka değiştirin
- Database password'lerini güvenli tutun
- CORS ayarlarını production için düzenleyin

## 🐛 Sorun Giderme

### Database bağlantı sorunu
```bash
# Container'ın çalıştığını kontrol edin
docker ps

# Database loglarını kontrol edin
docker-compose logs postgres

# Bağlantıyı test edin
docker exec tours-postgres pg_isready -U postgres
```

### Port çakışması
```bash
# 5432 portunu kullanan process'i bulun
lsof -i :5432

# Process'i sonlandırın veya farklı port kullanın
```

### Migration sorunları
```bash
# Migration'ı manuel çalıştırın
cd backend
node scripts/migrate.js
```
