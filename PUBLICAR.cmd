@echo off
rem Publica a apresentacao (pasta web) no Cloudflare (Workers com arquivos estaticos): https://ciki160-hnv-7k3q.acalaes.workers.dev
rem Copia so o que vai ao ar (sem pastas de teste, notas .md e scripts .py) e envia com o wrangler.
setlocal
set "ORIGEM=%~dp0web"
set "DESTINO=%TEMP%\ciki-site"

if exist "%DESTINO%" rmdir /s /q "%DESTINO%"
robocopy "%ORIGEM%" "%DESTINO%" /E /XD qa* __pycache__ /XF *.md *.py *.cmd paineis_teste.html >nul
if errorlevel 8 (
  echo Falha ao copiar os arquivos.
  exit /b 1
)

rem Pede ao Google e similares para nao indexar a pagina
> "%DESTINO%\robots.txt" (echo User-agent: *& echo Disallow: /)
> "%DESTINO%\_headers" (echo /*& echo   X-Robots-Tag: noindex, nofollow)

rem Roda a partir da pasta temporaria para nao usar o wrangler.jsonc do projeto (ele aponta para a pasta web inteira)
pushd "%TEMP%"
call wrangler deploy --assets "%DESTINO%" --name ciki160-hnv-7k3q --compatibility-date 2026-10-12
set "RESULTADO=%errorlevel%"
popd
if not "%RESULTADO%"=="0" (
  echo Falha ao publicar.
  exit /b 1
)
echo.
echo Publicado: https://ciki160-hnv-7k3q.acalaes.workers.dev
endlocal
