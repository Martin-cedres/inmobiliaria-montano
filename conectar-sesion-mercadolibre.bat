@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==================================================================
echo   INMOBILIARIA MONTAÑO - CONECTAR SESIÓN DE MERCADO LIBRE UY
echo ==================================================================
call npm run market:login-ml
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
