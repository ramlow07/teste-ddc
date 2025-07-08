#!/bin/bash

# =====================================================
# Environment Setup Script
# Creates .env file with database configuration
# =====================================================

set -e

ENV_FILE=".env"

echo "🔧 Setting up environment configuration..."

# Create .env file
cat > $ENV_FILE << 'EOF'
# =====================================================
# PROJECT ENVIRONMENT VARIABLES
# Based on actual usage in the codebase
# =====================================================

# APPLICATION CONFIGURATION
NODE_ENV=development
PORT_ADMIN=3000

# JWT AUTHENTICATION
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production-please

# PRISMA DATABASE CONFIGURATION (Primary)
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/teste_backend_db?schema=workspace"

# TYPEORM DATABASE CONFIGURATION (Legacy/Secondary)
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_DB=teste_backend_db
EOF

echo "✅ Environment file created: $ENV_FILE"
echo ""
echo "🔍 Environment Variables Analysis:"
echo "  ✅ NODE_ENV - Used in app.service.ts"
echo "  ✅ PORT_ADMIN - Used in main.ts and app.service.ts" 
echo "  ✅ JWT_SECRET_KEY - Used in jwtOptionalAuth.guard.ts"
echo "  ✅ DATABASE_URL - Used in prisma/schema.prisma"
echo "  ✅ DB_* variables - Used in datasource.ts (TypeORM)"
echo ""
echo "📝 Next steps:"
echo "1. Review and update the JWT_SECRET_KEY in .env"
echo "2. Run: chmod +x database.sh"
echo "3. Run: ./database.sh"
echo "4. Run: npm install"
echo "5. Run: npx prisma generate"
echo "6. Run: npx prisma migrate dev"
echo "7. Run: npm run seed" 