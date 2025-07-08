#!/bin/bash

# =====================================================
# Database Setup Script with Docker PostgreSQL
# =====================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configuration
DB_NAME="teste_backend_db"
DB_USER="postgres"
DB_PASSWORD="postgres123"
DB_PORT="5432"
CONTAINER_NAME="teste-postgres-db"
POSTGRES_VERSION="15-alpine"

echo -e "${BLUE}🚀 Starting PostgreSQL Database Setup${NC}"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is running${NC}"
}

# Function to stop and remove existing container
cleanup_existing() {
    if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo -e "${YELLOW}🗑️  Stopping and removing existing container: ${CONTAINER_NAME}${NC}"
        docker stop ${CONTAINER_NAME} >/dev/null 2>&1 || true
        docker rm ${CONTAINER_NAME} >/dev/null 2>&1 || true
    fi
}

# Function to start PostgreSQL container
start_postgres() {
    echo -e "${BLUE}🐘 Starting PostgreSQL container...${NC}"
    
    docker run -d \
        --name ${CONTAINER_NAME} \
        -e POSTGRES_DB=${DB_NAME} \
        -e POSTGRES_USER=${DB_USER} \
        -e POSTGRES_PASSWORD=${DB_PASSWORD} \
        -p ${DB_PORT}:5432 \
        -v postgres_data:/var/lib/postgresql/data \
        postgres:${POSTGRES_VERSION}
    
    echo -e "${GREEN}✅ PostgreSQL container started successfully${NC}"
}

# Function to wait for PostgreSQL to be ready
wait_for_postgres() {
    echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
    
    for i in {1..30}; do
        if docker exec ${CONTAINER_NAME} pg_isready -U ${DB_USER} -d ${DB_NAME} >/dev/null 2>&1; then
            echo -e "${GREEN}✅ PostgreSQL is ready!${NC}"
            return 0
        fi
        echo -n "."
        sleep 2
    done
    
    echo -e "${RED}❌ PostgreSQL failed to start within 60 seconds${NC}"
    exit 1
}

# Function to create schemas and extensions
setup_database() {
    echo -e "${BLUE}🔧 Setting up database schemas and extensions...${NC}"
    
    # Create UUID extension and workspace schema
    docker exec -i ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME} << EOF
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create workspace schema
CREATE SCHEMA IF NOT EXISTS workspace;

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA workspace TO ${DB_USER};
GRANT ALL PRIVILEGES ON SCHEMA public TO ${DB_USER};

-- Show created schemas
\dn
EOF
    
    echo -e "${GREEN}✅ Database schemas and extensions created${NC}"
}

# Function to display connection info
show_connection_info() {
    echo -e "${GREEN}📋 Database Connection Information:${NC}"
    echo -e "  🏠 Host: localhost"
    echo -e "  🔌 Port: ${DB_PORT}"
    echo -e "  📁 Database: ${DB_NAME}"
    echo -e "  👤 Username: ${DB_USER}"
    echo -e "  🔐 Password: ${DB_PASSWORD}"
    echo -e "  📄 Schema: workspace"
    echo ""
    echo -e "  🔗 Connection URL: postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}"
    echo ""
    echo -e "${BLUE}📝 .env configuration:${NC}"
    echo -e "  DATABASE_URL=\"postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}?schema=workspace\""
}

# Function to show Docker commands
show_docker_commands() {
    echo -e "${BLUE}🐳 Useful Docker Commands:${NC}"
    echo -e "  🟢 Start container: ${GREEN}docker start ${CONTAINER_NAME}${NC}"
    echo -e "  🔴 Stop container: ${RED}docker stop ${CONTAINER_NAME}${NC}"
    echo -e "  🗑️  Remove container: ${YELLOW}docker rm ${CONTAINER_NAME}${NC}"
    echo -e "  📊 Container logs: ${BLUE}docker logs ${CONTAINER_NAME}${NC}"
    echo -e "  💻 Access psql: ${BLUE}docker exec -it ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME}${NC}"
    echo ""
    echo -e "${BLUE}🚀 Next Steps:${NC}"
    echo -e "  1. Update your .env file with the connection string above"
    echo -e "  2. Run: ${GREEN}npx prisma generate${NC}"
    echo -e "  3. Run: ${GREEN}npx prisma migrate dev${NC}"
    echo -e "  4. Run: ${GREEN}npm run seed${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}===========================================${NC}"
    echo -e "${BLUE}🏗️  PostgreSQL Database Setup for Backend${NC}"
    echo -e "${BLUE}===========================================${NC}"
    echo ""
    
    check_docker
    cleanup_existing
    start_postgres
    wait_for_postgres
    setup_database
    
    echo ""
    echo -e "${GREEN}🎉 Database setup completed successfully!${NC}"
    echo ""
    
    show_connection_info
    echo ""
    show_docker_commands
}

# Handle script arguments
case "${1:-}" in
    "start")
        echo -e "${BLUE}🟢 Starting existing PostgreSQL container...${NC}"
        docker start ${CONTAINER_NAME}
        echo -e "${GREEN}✅ Container started${NC}"
        ;;
    "stop")
        echo -e "${BLUE}🔴 Stopping PostgreSQL container...${NC}"
        docker stop ${CONTAINER_NAME}
        echo -e "${GREEN}✅ Container stopped${NC}"
        ;;
    "restart")
        echo -e "${BLUE}🔄 Restarting PostgreSQL container...${NC}"
        docker restart ${CONTAINER_NAME}
        echo -e "${GREEN}✅ Container restarted${NC}"
        ;;
    "logs")
        echo -e "${BLUE}📊 Showing container logs...${NC}"
        docker logs -f ${CONTAINER_NAME}
        ;;
    "psql")
        echo -e "${BLUE}💻 Connecting to PostgreSQL...${NC}"
        docker exec -it ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME}
        ;;
    "status")
        echo -e "${BLUE}📊 Container status:${NC}"
        docker ps -a | grep ${CONTAINER_NAME} || echo "Container not found"
        ;;
    "remove")
        echo -e "${YELLOW}🗑️  Removing PostgreSQL container and data...${NC}"
        read -p "Are you sure? This will delete all data (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker stop ${CONTAINER_NAME} >/dev/null 2>&1 || true
            docker rm ${CONTAINER_NAME} >/dev/null 2>&1 || true
            docker volume rm postgres_data >/dev/null 2>&1 || true
            echo -e "${GREEN}✅ Container and data removed${NC}"
        else
            echo -e "${BLUE}❌ Operation cancelled${NC}"
        fi
        ;;
    "help"|"-h"|"--help")
        echo -e "${BLUE}📖 Usage: ./database.sh [COMMAND]${NC}"
        echo ""
        echo -e "${BLUE}Commands:${NC}"
        echo -e "  ${GREEN}(no args)${NC}  Setup new PostgreSQL database"
        echo -e "  ${GREEN}start${NC}      Start existing container"
        echo -e "  ${GREEN}stop${NC}       Stop container"
        echo -e "  ${GREEN}restart${NC}    Restart container"
        echo -e "  ${GREEN}logs${NC}       Show container logs"
        echo -e "  ${GREEN}psql${NC}       Connect to PostgreSQL"
        echo -e "  ${GREEN}status${NC}     Show container status"
        echo -e "  ${GREEN}remove${NC}     Remove container and data"
        echo -e "  ${GREEN}help${NC}       Show this help"
        ;;
    "")
        main
        ;;
    *)
        echo -e "${RED}❌ Unknown command: ${1}${NC}"
        echo -e "${BLUE}Run './database.sh help' for usage information${NC}"
        exit 1
        ;;
esac 