#!/usr/bin/env pwsh
<#
Deploys the frontend to proxy.bccdev.id:
push local commits, then on the server git pull + rebuild + restart the
`web` container.

Usage: ./deploy.ps1 [-Service web]
#>
param(
    [string]$Service = "web"
)

$ErrorActionPreference = "Stop"

$SshHost = "dev@proxy.bccdev.id"
$SshPort = 11051
$RemoteDir = "~/backend"

function Step($msg) {
    Write-Host "==> $msg" -ForegroundColor Cyan
}

# 1. Refuse to deploy uncommitted local changes silently
$dirty = git status --porcelain
if ($dirty) {
    Write-Host "You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host $dirty
    $answer = Read-Host "Continue and deploy the last commit anyway? (y/N)"
    if ($answer -ne "y") {
        Write-Host "Aborted." -ForegroundColor Red
        exit 1
    }
}

# 2. Push to origin
Step "Pushing to origin"
git push origin main
if ($LASTEXITCODE -ne 0) { throw "git push failed" }

# 3. Pull + rebuild + restart on the server
Step "Pulling and rebuilding '$Service' on the server"
$remoteCmd = "cd $RemoteDir && git pull && docker compose build $Service && docker compose up -d $Service"
ssh -p $SshPort $SshHost $remoteCmd
if ($LASTEXITCODE -ne 0) { throw "remote deploy failed" }

# 4. Quick smoke check
Step "Smoke check"
ssh -p $SshPort $SshHost "docker ps --filter name=pahamin_$Service --format 'table {{.Names}}\t{{.Status}}' && curl -sI http://127.0.0.1/ | head -1"

Step "Done"
