# PowerShell API Testing Commands
# Copy and paste these into your PowerShell terminal

# 1. Health Check
Write-Host "Testing Health Check..." -ForegroundColor Green
Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -Method GET | ConvertTo-Json -Depth 3

Write-Host "`nTesting Portfolio Summary..." -ForegroundColor Green  
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/portfolio" -Method GET | ConvertTo-Json -Depth 5

Write-Host "`nTesting Trade History..." -ForegroundColor Green
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/trades" -Method GET | ConvertTo-Json -Depth 5

Write-Host "`nTesting Trade Statistics..." -ForegroundColor Green
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/trades/stats" -Method GET | ConvertTo-Json -Depth 3

Write-Host "`nTesting P&L History..." -ForegroundColor Green
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/pnl/history" -Method GET | ConvertTo-Json -Depth 5

Write-Host "`nManual Testing Complete!" -ForegroundColor Yellow