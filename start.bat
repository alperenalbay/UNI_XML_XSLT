@echo off
title UNI XML ^& XSLT Baslatici
cd /d "%~dp0"

echo ===================================================
echo             UNI XML ^& XSLT CANLI EDITOR
echo ===================================================
echo.

:: Sunucu zaten calisiyor mu kontrol et (Port 5173 dinleniyor mu?)
echo ADIM 1: Port Kontrolu Yapiliyor...
netstat -ano | findstr LISTENING | findstr :5173 >nul 2>&1
if %errorlevel% equ 0 goto :ALREADY_RUNNING
echo [OK] Port 5173 bos, yeni sunucu baslatilacak.
echo.
goto :CHECK_NODE

:ALREADY_RUNNING
echo.
echo [BILGI] Uygulama zaten arka planda calisiyor!
echo [OK] Tarayicinizda calisan adrese yonlendiriliyorsunuz...
echo.
start http://localhost:5173
timeout /t 2 >nul
exit /b

:CHECK_NODE
:: Node.js kontrolu
echo ADIM 2: Node.js Sistem Kontrolu Yapiliyor...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo HATA: Sisteminizde Node.js kurulu degil!
    echo Bu uygulamayi yerel olarak calistirmak icin Node.js gereklidir.
    echo Lutfen https://nodejs.org adresinden Node.js kurup tekrar deneyin.
    echo.
    pause
    exit /b
)
echo [OK] Node.js kurulu.
echo.

:: Git guncelleme kontrolu ve otomatik guncelleme
echo ADIM 3: Guncellemeler Denetleniyor (GitHub baglantisi)...
echo (Baglanti durumuna gore 2-5 saniye surebilir, lutfen bekleyin...)

git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [BILGI] Git kurulu olmadigi icin guncelleme denetimi atlandi.
    goto :CHECK_MODULES
)

if not exist .git (
    echo [BILGI] Git deposu bulunamadigi icin guncelleme denetimi atlandi.
    goto :CHECK_MODULES
)

:: Git is available and it is a repo
git fetch origin main >nul 2>&1
if %errorlevel% neq 0 (
    echo [UYARI] GitHub ile baglanti kurulamadi, guncelleme denetimi atlandi.
    goto :CHECK_MODULES
)

:: Get hashes
set LOCAL_HASH=
for /f "tokens=*" %%a in ('git rev-parse HEAD') do set LOCAL_HASH=%%a
set REMOTE_HASH=
for /f "tokens=*" %%b in ('git rev-parse origin/main') do set REMOTE_HASH=%%b

if "%LOCAL_HASH%"=="" (
    echo [UYARI] Yerel surum bilgisi alinamadi.
    goto :CHECK_MODULES
)
if "%REMOTE_HASH%"=="" (
    echo [UYARI] Uzak sunucu surum bilgisi alinamadi.
    goto :CHECK_MODULES
)

if "%LOCAL_HASH%"=="%REMOTE_HASH%" (
    echo [OK] Uygulama en guncel surumde.
    goto :CHECK_MODULES
)

echo.
echo =======================================================
echo  YENI SURUM BULUNDU! (Uzak sunucuda guncelleme var)
echo =======================================================
echo.
set /p UPDATE_CHOICE="Yeni surumu otomatik yuklemek ister misiniz? (E/H): "
if /i not "%UPDATE_CHOICE%"=="E" (
    echo Guncelleme atlandi.
    goto :CHECK_MODULES
)

echo.
echo [>] Kodlar guncelleniyor (git pull)...
call git pull
echo.
echo [>] Bagimliliklar kontrol ediliyor (npm install)...
call npm install
echo [OK] Guncelleme basariyla tamamlandi!
echo.

:CHECK_MODULES
:: node_modules kontrolu ve kurulumu
echo ADIM 4: Paket Bagimliliklari Denetleniyor (node_modules)...
if exist node_modules (
    echo [OK] Bagimliliklar zaten kurulu.
    goto :START_SERVER
)

echo.
echo [BILGI] Bagimliliklar eksik! Paketler kuruluyor...
echo (Bu islem internet hizina gore 1-2 dakika surebilir, kapatmayin...)
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
echo [OK] Kurulum tamamlandi.
echo.

:START_SERVER
:: Sunucu baslatma
echo ADIM 5: Canli Sunucu Baslatiliyor (Vite)...
echo.
echo ===================================================
echo   SUNUCU AKTIF EDILIYOR - LUTFEN PENCEREYI KAPATMAYIN!
echo   Tarayiciniz otomatik olarak acilacaktir.
echo ===================================================
echo.

start http://localhost:5173
call npm run dev
if %errorlevel% neq 0 (
    echo.
    echo HATA: Sunucu baslatilamadi.
    echo.
    pause
)
