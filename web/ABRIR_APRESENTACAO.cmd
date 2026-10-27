@echo off
rem Abre a apresentacao por localhost (necessario para a janela do apresentador, tecla P).
rem Mantenha esta janela aberta durante a apresentacao; feche para encerrar o servidor.
cd /d "%~dp0"
start "" "http://localhost:8765/index.html"
py -m http.server 8765 --bind 127.0.0.1
