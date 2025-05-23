# TipJar Local Setup and Startup PowerShell Script

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "TipJar Local Setup and Startup" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Using Node.js version: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Node.js is not installed or not in your PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "Using npm version: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: npm is not installed or not in your PATH" -ForegroundColor Red
    Write-Host "Please ensure npm is installed with Node.js" -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
if (-Not(Test-Path -Path ".env" -PathType Leaf)) {
    Write-Host "Creating .env file..."
    Copy-Item -Path ".env.example" -Destination ".env" -ErrorAction SilentlyContinue
    if (-Not(Test-Path -Path ".env" -PathType Leaf)) {
        # If .env.example doesn't exist, create a basic .env file
        @"
# TipJar Pro Environment Variables

# API Keys
GEMINI_API_KEY=AIzaSyC7nxxes3zgZCt-z2V_VvE2bw0UBKbumu0

# Database Configuration
DATABASE_URL=

# Session Secret (for production)
# SESSION_SECRET=

# Environment
NODE_ENV=development
"@ | Out-File -FilePath ".env" -Encoding utf8
    }
    Write-Host "Created .env file. Please edit it with your configuration."
    Write-Host "Press any key to open the file..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    notepad ".env"
}

# Check if the Gemini API key is set
$envContent = Get-Content -Path ".env" -Raw
if ($envContent -notmatch "GEMINI_API_KEY=.+") {
    Write-Host "Gemini API key not found in .env file."
    $apiKey = Read-Host "Please enter your Gemini API key"
    
    # Replace the empty GEMINI_API_KEY line with the provided key
    $envContent = $envContent -replace "GEMINI_API_KEY=", "GEMINI_API_KEY=$apiKey"
    $envContent | Out-File -FilePath ".env" -Encoding utf8
    
    Write-Host "API key added to .env file."
}

# Check if node_modules exists
if (-Not(Test-Path -Path "node_modules" -PathType Container)) {
    Write-Host "Installing dependencies..."
    npm install
}

# Build the project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed" -ForegroundColor Red
    exit 1
}

# Set environment variable for development
$env:NODE_ENV = "development"

# Start the server
Write-Host "Starting TipJar application..." -ForegroundColor Green
Write-Host "Application will be available at http://localhost:5000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the application" -ForegroundColor Yellow

# Run the application with npm script
Write-Host "Starting the application..."
npm run dev:local

Write-Host "Application has stopped" -ForegroundColor Yellow
Read-Host "Press Enter to exit"