# Publish this project to GitHub Pages
# Double-click publish-github.bat instead of running this file directly.

$ErrorActionPreference = 'Stop'

$user = 'lisis0423'
$repo = 'grade7-knowledge-quiz'
$pagesUrl = "https://$user.github.io/$repo/"

Set-Location $PSScriptRoot

Write-Host ""
Write-Host "=== Publish grade7-knowledge-quiz to GitHub Pages ===" -ForegroundColor Cyan
Write-Host "Target: https://github.com/$user/$repo"
Write-Host ""

# --- 1. local repository ------------------------------------------------
if (-not (Test-Path '.git')) {
    Write-Host "Initializing local repository..." -ForegroundColor DarkGray
    git init -b main | Out-Null
}

git config user.name $user
git config user.email "$user@users.noreply.github.com"

git add -A
$pending = git status --porcelain
if ($pending) {
    Write-Host "Committing local changes..." -ForegroundColor DarkGray
    git commit -m "update: content" | Out-Null
}

# --- 2. remote ----------------------------------------------------------
$remotes = git remote
if ($remotes -notcontains 'origin') {
    git remote add origin "https://github.com/$user/$repo.git"
}

# --- 3. push ------------------------------------------------------------
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "If a browser window asks you to sign in, sign in with your GitHub account and approve." -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Push failed." -ForegroundColor Red
    Write-Host ""

    # 先判断是「仓库不存在」还是「网络问题」。网络问题在国内网络环境很常见，
    # 尤其是 Recv failure / Connection was reset，重试或换网络通常就能通过。
    $remoteHeads = git ls-remote --heads origin main 2>$null
    if ($LASTEXITCODE -ne 0 -or -not $remoteHeads) {
        Write-Host "The repository cannot be reached. Two common causes:"
        Write-Host ""
        Write-Host "  1) The repository does not exist yet. Create an EMPTY public repository:"
        Write-Host "     https://github.com/new?name=$repo&visibility=public"
        Write-Host "     Important: do NOT tick 'Add a README', '.gitignore' or 'license'."
        Write-Host ""
        Write-Host "  2) The network to github.com is blocked or unstable."
        Write-Host "     Messages like 'Recv failure' or 'Connection was reset' mean this."
        Write-Host "     Try again, switch network (mobile hotspot), or enable a proxy/VPN."
    } else {
        $remoteSha = ($remoteHeads -split "\s+")[0]
        $localSha = git rev-parse HEAD
        if ($remoteSha -eq $localSha) {
            Write-Host "Nothing to push: GitHub already has this exact version." -ForegroundColor Green
            Write-Host "The connection error above is harmless; the site is already up to date:"
            Write-Host "  $pagesUrl" -ForegroundColor Green
        } else {
            Write-Host "The repository exists, but the network to github.com dropped."
            Write-Host "GitHub has: $($remoteSha.Substring(0,7))   Local has: $($localSha.Substring(0,7))"
            Write-Host ""
            Write-Host "Try again, switch network (mobile hotspot), or enable a proxy/VPN."
        }
    }
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Pushed successfully." -ForegroundColor Green

# --- 4. enable Pages ----------------------------------------------------
Write-Host "Opening GitHub Pages settings..." -ForegroundColor Cyan
Start-Process "https://github.com/$user/$repo/settings/pages"

Write-Host ""
Write-Host "In the page that just opened, set:"
Write-Host "  Source : Deploy from a branch"
Write-Host "  Branch : main"
Write-Host "  Folder : / (root)"
Write-Host "  then click Save."
Write-Host ""
Write-Host "Wait 1-3 minutes, then open:"
Write-Host "  $pagesUrl" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"