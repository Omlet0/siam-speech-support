
#!/bin/bash

# VM Monitoring Dashboard - Production Deployment Script

set -e

echo "🚀 Starting VM Monitoring Dashboard deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start services
echo "📦 Building Docker images..."
docker-compose build --no-cache

echo "🔄 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service health
if docker-compose ps | grep -q "healthy"; then
    echo "✅ VM Monitoring Dashboard is running successfully!"
    echo "🌐 Access the dashboard at: http://localhost:3000"
    echo "📊 Prometheus monitoring at: http://localhost:9090"
else
    echo "❌ Some services are not healthy. Check logs:"
    docker-compose logs
    exit 1
fi

echo "📋 Deployment Summary:"
echo "- Dashboard: http://localhost:3000"
echo "- Health Check: http://localhost:3000/health"
echo "- Prometheus: http://localhost:9090"
echo ""
echo "🔧 Useful commands:"
echo "- View logs: docker-compose logs -f"
echo "- Stop services: docker-compose down"
echo "- Restart: docker-compose restart"
