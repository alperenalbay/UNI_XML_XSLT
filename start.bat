@echo off
title UNI XML & XSLT Baslatici
echo ===================================================
echo             UNI XML & XSLT CANLI EDITOR
echo ===================================================
echo.

:: Node.js kontrolü
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo HATA: Sisteminizde Node.js kurulu degil!
    echo Lutfen https://nodejs.org adresinden Node.js kurup tekrar deneyin.
    echo.
    pause
    exit /b
)

:: node_modules kontrolü ve kurulum
if not exist node_modules (
    echo [1/2] Bagimliliklar kuruluyor (npm install)... Bu islem birkac dakika surebilir...
    call npm install
) else (
    echo [1/2] Bagimliliklar zaten kurulu.
)

echo.
echo [2/2] Canli editor baslatiliyor (npm run dev)...
echo Tarayiciniz otomatik olarak acilacaktir...
echo.

:: Tarayıcıyı aç ve dev sunucusunu başlat
start http://localhost:5173
call npm run dev

pause
