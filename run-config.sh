#/bin/bash

# See
# - https://github.com/hi-ogawa/morphology-db/wiki/Deployment
# - https://github.com/hi-ogawa/cloud-run-script

# Project to use cloud run
PROJECT_ID='morphology-db-0000'
PROJECT_NAME='Morphology DB'

# Used for image name and service name
APP_NAME='backend'

# Cloud run settings (more on "gcloud beta run deploy --help")
REGION='asia-northeast1'
PLATFORM='managed'
DEPLOY_OPTS=(
  --allow-unauthenticated
  --cpu=1
  --memory=512Mi   # default 256Mi
  --concurrency=10 # default 80
  --timeout=1m     # default 5m
)

# Specify local image name
IMAGE_NAME='hiogawa/morphology-db'
