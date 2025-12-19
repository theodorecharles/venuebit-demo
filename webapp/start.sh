#!/bin/bash

# VenueBit WebApp Start Script

echo "Starting VenueBit WebApp..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  Please update .env with your Optimizely SDK key"
    echo ""
fi

# Start the dev server
echo "Starting development server on http://localhost:4000"
npm run dev
