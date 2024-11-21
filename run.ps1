# Load environment variables from .env
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        $parts = $_ -split "="
        $env:$($parts[0].Trim()) = $parts[1].Trim()
    }
}

# Default values if .env is missing or variables are unset
$PORT = $env:PORT -or 3000
$NODE_ENV = $env:NODE_ENV -or "development"

# Determine the stage to build and run
if ($NODE_ENV -eq "development") {
    $TARGET = "dev"
    $IMAGE_NAME = "benchy-dev"
} else {
    $TARGET = "prod"
    $IMAGE_NAME = "benchy"
}

# Build the Docker image
Write-Host "Building Docker image for $NODE_ENV..."
docker build -t $IMAGE_NAME --target $TARGET .

# Run the Docker container
Write-Host "Starting Docker container on port $PORT..."
docker run -p "$PORT:$PORT" --env PORT=$PORT $IMAGE_NAME
