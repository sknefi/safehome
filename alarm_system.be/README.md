1. Příprava projektu
Naklonujte si repozitář:
git clone git@github.com:fathaaland/alarm_system.be.git
Přepněte se do složky projektu: cd src

3. Instalace závislostí
Nainstalujte potřebné balíčky: npm install
Instalace dalších požadovaných balíčků: npm install nodemon express mongoose

4. Nastavení databáze Vytvořte si účet na MongoDB Atlas. Zkopírujte connection string a vložte ho do .env souboru

5. Spuštění projektu: nodemon server.js
Aplikace by měla běžet na: http://localhost:3000

6. Testování
Pro testování API můžete použít Postman nebo Insomnia

Důležité soubory
.env - konfigurační soubor (je potřeba vytvořit) - NAPISTE A POSLU VAM HO!
server.js - hlavní vstupní bod aplikace
models/ - obsahuje databázové modely
routes/ - definice API endpointů
