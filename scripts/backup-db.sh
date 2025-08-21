#!/bin/bash

# Database backup script for Big Brother Fantasy App
# Usage: ./scripts/backup-db.sh

set -e

# Load environment variables
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="bbfantasy_backup_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Extract database connection details from DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    exit 1
fi

echo "Creating database backup..."

# Create backup using pg_dump
pg_dump "$DATABASE_URL" > "$BACKUP_DIR/$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Backup created successfully: $BACKUP_DIR/$BACKUP_FILE"
    
    # Compress the backup
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    echo "Backup compressed: $BACKUP_DIR/$BACKUP_FILE.gz"
    
    # Clean up old backups (keep last 7 days)
    find $BACKUP_DIR -name "bbfantasy_backup_*.sql.gz" -mtime +7 -delete
    echo "Old backups cleaned up"
else
    echo "Error: Backup failed"
    exit 1
fi

echo "Database backup completed successfully"
