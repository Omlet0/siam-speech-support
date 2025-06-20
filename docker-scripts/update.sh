
#!/bin/bash

# VM Monitoring Dashboard - Update Script

set -e

echo "🔄 Updating VM Monitoring Dashboard..."

# Pull latest changes (if using git)
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes..."
    git pull
fi

# Rebuild and restart
echo "🔨 Rebuilding services..."
docker-compose build --no-cache

echo "🔄 Restarting services..."
docker-compose down
docker-compose up -d

echo "✅ Update completed successfully!"
