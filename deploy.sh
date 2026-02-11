#!/bin/bash

# Stop script immediately if any command fails
set -e

LOG_FILE="deploy.log"

echo "===== Deployment Started: $(date) =====" | tee -a $LOG_FILE

run_command() {
    echo "Running: $1" | tee -a $LOG_FILE
    eval $1 2>&1 | tee -a $LOG_FILE
}

# 1. Stop containers
run_command "docker compose down"

# 2. Prune images
run_command "docker image prune -a -f"

# 3. Pull latest code
run_command "git pull"

# 4. Start containers
run_command "docker compose -f docker-compose.prod.yml up -d"

echo "===== Deployment Successful: $(date) =====" | tee -a $LOG_FILE