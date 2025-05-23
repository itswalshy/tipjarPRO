@echo off
setlocal enabledelayedexpansion

:: Check if .env file exists
if not exist ".env" (
    echo Creating .env file...
    
    if exist ".env.example" (
        copy ".env.example" ".env"
    ) else (
        echo # TipJar Pro Environment Variables> .env
        echo.>> .env
        echo # API Keys>> .env
        echo GEMINI_API_KEY=>> .env
        echo.>> .env
        echo # Database Configuration>> .env
        echo DATABASE_URL=>> .env
        echo.>> .env
        echo # Session Secret (for production)>> .env
        echo # SESSION_SECRET=>> .env
        echo.>> .env
        echo # Environment>> .env
        echo NODE_ENV=development>> .env
    )
    
    echo Created .env file. Please edit it with your configuration.
    echo Press any key to open the file...
    pause > nul
    start notepad ".env"
)

:: Check if the Gemini API key is set
set "apiKeySet="
for /f "usebackq tokens=1* delims==" %%a in (".env") do (
    if "%%a"=="GEMINI_API_KEY" (
        if not "%%b"=="" set "apiKeySet=yes"
    )
)

if not defined apiKeySet (
    echo Gemini API key not found in .env file.
    set /p apiKey="Please enter your Gemini API key: "
    
    set "tempFile=%temp%\env.tmp"
    del "!tempFile!" 2>nul
    
    for /f "usebackq tokens=1* delims==" %%a in (".env") do (
        if "%%a"=="GEMINI_API_KEY" (
            echo GEMINI_API_KEY=!apiKey!>> "!tempFile!"
        ) else (
            if "%%b"=="" (
                echo %%a>> "!tempFile!"
            ) else (
                echo %%a=%%b>> "!tempFile!"
            )
        )
    )
    
    move /y "!tempFile!" ".env" > nul
    echo API key added to .env file.
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

:: Run the application
echo Starting the application...
echo Press Ctrl+C to stop the application
call npm run dev:local