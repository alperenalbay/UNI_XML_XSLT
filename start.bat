@echo off
title UNI XML & XSLT Baslatici
echo ===================================================
echo             UNI XML & XSLT CANLI EDITOR
echo ===================================================
echo.

:: Port 5173 zaten dinleniyor mu kontrol et (Arka planda calisiyorsa)
netstat -an | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo [BILGI] Canli sunucu zaten arka planda calisiyor.
    echo Tarayici sayfaniz aciliyor...
    echo.
    start http://localhost:5173
    timeout /t 2 >nul
    exit
)

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
echo Tarayiciniz otomatik olarak acilacaktir...
echo.

:: Tarayıcıyı garanti şekilde aç
start http://localhost:5173

:: Vite sunucusunu başlat
call npm run dev
if %errorlevel% neq 0 (
    echo.
    echo HATA: Sunucu baslatilamadi.
    echo.
    pause
)
