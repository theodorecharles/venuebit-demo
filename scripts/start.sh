#!/bin/bash

# VenueBit Demo - Local Development Startup Script

set -e

echo "🎫 Starting VenueBit Demo..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and start containers
echo "📦 Building and starting containers..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 3

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ VenueBit Demo is running!"
    echo ""
    echo "   🌐 Webapp:  http://localhost:4000"
    echo "   🔌 Backend: http://localhost:4001"
    echo ""
    echo "   To view logs:  docker-compose logs -f"
    echo "   To stop:       docker-compose down"
    echo ""
else
    echo "❌ Failed to start services. Check logs with: docker-compose logs"
    exit 1
fi
