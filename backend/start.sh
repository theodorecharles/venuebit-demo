#!/bin/bash

echo "=========================================="
echo "VenueBit Backend - Quick Start"
echo "=========================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js 20 or higher"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo "💡 Edit .env to add your OPTIMIZELY_SDK_KEY"
    echo ""
fi

echo "🚀 Starting development server..."
echo ""
npm run dev
