#!/bin/bash
cd "$(dirname "$0")"

echo "==================================================="
echo "             UNI XML & XSLT CANLI EDITOR"
echo "==================================================="
echo ""

# Sunucu zaten calisiyor mu kontrol et
echo "ADIM 1: Port Kontrolu Yapiliyor..."
ALREADY_RUNNING=0
if command -v lsof &> /dev/null; then
    if lsof -i :5173 &> /dev/null; then
        ALREADY_RUNNING=1
    fi
elif command -v nc &> /dev/null; then
    if nc -z 127.0.0.1 5173 &> /dev/null; then
        ALREADY_RUNNING=1
    fi
fi

if [ $ALREADY_RUNNING -eq 1 ]; then
    echo ""
    echo "[BILGI] Uygulama zaten arka planda calisiyor!"
    echo "[OK] Tarayiciniza yonlendiriliyorsunuz..."
    echo ""
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:5173"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "http://localhost:5173" 2>/dev/null || true
    fi
    sleep 2
    exit 0
fi
echo "[OK] Port 5173 bos, yeni sunucu baslatilacak."
echo ""

# Node.js kontrolu
echo "ADIM 2: Node.js Sistem Kontrolu Yapiliyor..."
if ! command -v node &> /dev/null
then
    echo ""
    echo "HATA: Sisteminizde Node.js kurulu degil!"
    echo "Lutfen https://nodejs.org adresinden Node.js kurup tekrar deneyin."
    echo ""
    read -p "Cikis icin Enter tusuna basin..."
    exit 1
fi
echo "[OK] Node.js kurulu."
echo ""

# Git guncelleme kontrolu ve otomatik guncelleme
echo "ADIM 3: Guncellemeler Denetleniyor (GitHub baglantisi)..."
echo "(Baglanti durumuna gore 2-5 saniye surebilir, lutfen bekleyin...)"
if command -v git &> /dev/null && [ -d ".git" ]; then
    git fetch origin main &> /dev/null
    LOCAL_HASH=$(git rev-parse HEAD)
    REMOTE_HASH=$(git rev-parse origin/main)
    
    if [ "$LOCAL_HASH" != "$REMOTE_HASH" ]; then
        echo ""
        echo "==================================================="
        echo " YENI SURUM BULUNDU! (Uzak sunucuda guncelleme var)"
        echo "==================================================="
        echo ""
        read -p "Yeni surumu otomatik yuklemek ister misiniz? (E/H): " update_choice
        if [[ "$update_choice" =~ ^[EeYy]$ ]]; then
            echo ""
            echo "[>] Kodlar guncelleniyor (git pull)..."
            git pull
            echo ""
            echo "[>] Bagimliliklar kontrol ediliyor (npm install)..."
            npm install
            echo "[OK] Guncelleme basariyla tamamlandi!"
            echo ""
        fi
    else
        echo "[OK] Uygulama en guncel surumde."
    fi
else
    echo "[BILGI] Git kurulu olmadigi veya depo bulunamadigi icin guncelleme atlandi."
fi
echo ""

# node_modules kontrolu ve kurulumu
echo "ADIM 4: Paket Bagimliliklari Denetleniyor (node_modules)..."
if [ ! -d "node_modules" ]; then
    echo ""
    echo "[BILGI] Bagimliliklar eksik! Paketler kuruluyor..."
    echo "(Bu islem 1-2 dakika alabilir, lutfen bekleyin...)"
    npm install
    echo "[OK] Kurulum tamamlandi."
else
    echo "[OK] Bagimliliklar zaten kurulu."
fi
echo ""

# Sunucu baslatma
echo "ADIM 5: Canli Sunucu Baslatiliyor (Vite)..."
echo ""
echo "==================================================="
echo "  SUNUCU AKTIF EDILIYOR - PENCEREYI KAPATMAYIN!"
echo "  Tarayiciniz otomatik olarak acilacaktir."
echo "==================================================="
echo ""

if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:5173"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "http://localhost:5173" 2>/dev/null || true
fi

npm run dev
