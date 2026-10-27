@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==================================================================
echo   INMOBILIARIA MONTAÑO - ESCÁNER DE DUEÑOS VENDE (SAN JOSÉ)
echo ==================================================================
call npm run market:scan
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
