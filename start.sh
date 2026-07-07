#!/bin/bash

# Scriptin bulundugu dizine gec
cd "$(dirname "$0")"

echo "==================================================="
echo "             UNI XML & XSLT CANLI EDITOR"
echo "==================================================="
echo ""

# Port 5173 zaten dinleniyor mu kontrol et (Arka planda calisiyorsa)
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 || nc -z localhost 5173 >/dev/null 2>&1; then
    echo "[BILGI] Canli sunucu zaten arka planda calisiyor."
    echo "Tarayici sayfaniz aciliyor..."
    echo ""
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:5173"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "http://localhost:5173" 2>/dev/null
    fi
    exit 0
fi

# Node.js kontrolü
if ! command -v node &> /dev/null
then
    echo "HATA: Sisteminizde Node.js kurulu degil!"
    echo "Lutfen https://nodejs.org adresinden Node.js kurup tekrar deneyin."
    echo ""
    read -p "Cikis icin Enter tusuna basin..."
    exit 1
fi

# node_modules kontrolü ve kurulumu
if [ ! -d "node_modules" ]; then
    echo "[1/2] Bagimliliklar kuruluyor (npm install)... Bu islem birkac dakika surebilir..."
    npm install
else
    echo "[1/2] Bagimliliklar zaten kurulu."
fi

echo ""
echo "[2/2] Canli editor baslatiliyor (npm run dev)..."
echo "Tarayiciniz otomatik olarak acilacaktir..."
echo ""

# Isletim sistemine gore tarayiciyi otomatik ac
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "http://localhost:5173"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "http://localhost:5173" 2>/dev/null || echo "Lutfen tarayicinizdan http://localhost:5173 adresini acin."
else
    # Digerleri
    echo "Lutfen tarayicinizdan http://localhost:5173 adresini acin."
fi

npm run dev
