@echo off
title UNI XML ^& XSLT Baslatici
:: Calisma dizinini bat dosyasinin bulundugu klasor olarak ayarla (Cift tiklamada kritik!)
cd /d "%~dp0"

echo ===================================================
echo             UNI XML ^& XSLT CANLI EDITOR
echo ===================================================
echo.

:: Node.js kontrolu
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo HATA: Sisteminizde Node.js kurulu degil!
    echo Bu uygulamayi yerel olarak calistirmak icin Node.js gereklidir.
    echo Lutfen https://nodejs.org adresinden Node.js kurup tekrar deneyin.
    echo.
    pause
    exit /b
)

:: node_modules kontrolu ve kurulumu
if not exist node_modules (
    echo [1/2] Bagimliliklar kuruluyor... Bu islem ilk seferde 1-2 dakika surebilir...
    echo Lutfen bu pencereyi kapatmayin...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo HATA: Bagimliliklar kurulurken bir sorun olustu.
        echo Internet baglantinizi kontrol edip tekrar deneyin.
        echo.
        pause
        exit /b
    )
) else (
    echo [1/2] Bagimliliklar zaten kurulu.
)

echo.
echo [2/2] Canli sunucu baslatiliyor...
echo Tarayiciniz otomatik olarak acilacaktir...
echo.

:: Tarayiciyi ac
start http://localhost:5173

:: Vite sunucusunu baslat
call npm run dev
if %errorlevel% neq 0 (
    echo.
    echo HATA: Sunucu baslatilamadi.
    echo.
    pause
)
