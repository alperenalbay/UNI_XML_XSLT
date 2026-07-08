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

:: Git guncelleme kontrolu ve otomatik guncelleme
git --version >nul 2>&1
if %errorlevel% equ 0 (
    if exist .git (
        echo [0/2] Uygulama guncellemeleri kontrol ediliyor...
        git fetch origin main >nul 2>&1
        
        for /f "tokens=*" %%a in ('git rev-parse HEAD') do set LOCAL_HASH=%%a
        for /f "tokens=*" %%b in ('git rev-parse origin/main') do set REMOTE_HASH=%%b
        
        if not "%LOCAL_HASH%"=="%REMOTE_HASH%" (
            echo.
            echo =======================================================
            echo  YENI BIR SURUM MEVCUT! (Uzak sunucuda guncelleme var)
            echo =======================================================
            echo.
            set /p UPDATE_CHOICE="Yeni surumu otomatik yuklemek ister misiniz? (E/H): "
            if /i "%UPDATE_CHOICE%"=="E" (
                echo.
                echo Kodlar guncelleniyor (git pull)...
                call git pull
                echo.
                echo Bagimliliklar kontrol ediliyor (npm install)...
                call npm install
                echo.
                echo Guncelleme basariyla tamamlandi!
                echo.
            )
        ) else (
            echo [0/2] Uygulama en guncel surumde.
        )
    )
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
