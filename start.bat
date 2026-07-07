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
    echo Bu uygulamayi yerel olarak calistirmak icin Node.js gereklidir.
    echo Lutfen https://nodejs.org adresinden Node.js kurup tekrar deneyin.
    echo.
    echo VEYA uygulamayi hic indirmeden dogrudan web tarayicinizdan
    echo calistirmak icin online Vercel/GitHub Pages linkini kullanabilirsiniz.
    echo.
    pause
    exit /b
)

:: node_modules kontrolü ve kurulumu
if not exist node_modules (
    echo [1/2] Bagimliliklar kuruluyor (npm install)... Bu islem ilk seferde 1-2 dakika surebilir...
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
echo [2/2] Canli sunucu baslatiliyor (npm run dev)...
echo Sunucu hazir oldugunda tarayiciniz otomatik olarak acilacaktir...
echo.

:: Vite sunucusunu başlat (Vite otomatik olarak tarayıcıyı açacaktır)
call npm run dev
if %errorlevel% neq 0 (
    echo.
    echo HATA: Sunucu baslatilamadi.
    echo.
    pause
)
