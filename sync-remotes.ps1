# 一次把项目同步到 GitHub 和 AtomGit
# 用法：双击 sync-remotes.bat，或：
#   powershell -ExecutionPolicy Bypass -File .\sync-remotes.ps1

param([switch]$NoPause)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$targets = @(
    @{ name = 'GitHub';  remote = 'origin';  createUrl = 'https://github.com/new?name=grade7-knowledge-quiz&visibility=public' },
    @{ name = 'AtomGit'; remote = 'atomgit'; createUrl = 'https://atomgit.com/create/repo?name=grade7-knowledge-quiz' }
)

Write-Host ""
Write-Host "=== 同步到 GitHub / AtomGit ===" -ForegroundColor Cyan
Write-Host ""

# 1. 本地先提交
git add -A
if (git status --porcelain) {
    Write-Host "提交本地改动..." -ForegroundColor DarkGray
    git commit -m "update: content" | Out-Null
}

$remoteMap = @{}
$list = git remote
foreach ($r in $list) { $remoteMap[$r] = $true }

$report = @()

foreach ($t in $targets) {
    $name = $t.name
    $remote = $t.remote

    Write-Host ""
    Write-Host "--- $name ---" -ForegroundColor Cyan

    if (-not $remoteMap.ContainsKey($remote)) {
        Write-Host "缺少远端 $remote，先添加..." -ForegroundColor DarkGray
        switch ($remote) {
            'origin'  { git remote add origin  'https://github.com/lisis0423/grade7-knowledge-quiz.git' }
            'atomgit' { git remote add atomgit 'https://atomgit.com/lisis0423/grade7-knowledge-quiz.git' }
        }
    }

    # 先探测仓库是否存在，避免认证弹窗白等
    $oldPrompt = $env:GIT_TERMINAL_PROMPT
    $env:GIT_TERMINAL_PROMPT = '0'
    $prev = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    git -c credential.helper= ls-remote --heads $remote 2>&1 | Out-Null
    $probeOk = ($LASTEXITCODE -eq 0)
    if ($null -eq $oldPrompt) { Remove-Item Env:\GIT_TERMINAL_PROMPT -ErrorAction SilentlyContinue } else { $env:GIT_TERMINAL_PROMPT = $oldPrompt }
    $ErrorActionPreference = $prev

    if (-not $probeOk) {
        Write-Host "$name 上还没有这个仓库，或当前网络访问不到。" -ForegroundColor Yellow
        Write-Host "  如果是 Connection reset / 超时，就是网络问题，重试或换网络（手机热点）。" -ForegroundColor DarkGray
        Write-Host "  建空仓库（不要勾初始化 README）：$($t.createUrl)"
        $report += "$name : 跳过（仓库不存在或网络不通）"
        continue
    }

    Write-Host "推送中..." -ForegroundColor Yellow
    Write-Host "  首次推送需要登录；AtomGit 的密码位置要填个人访问令牌。" -ForegroundColor DarkGray
    $prev = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    $out = git push -u $remote main 2>&1
    $code = $LASTEXITCODE
    $ErrorActionPreference = $prev

    if ($code -eq 0) {
        Write-Host "$name 推送成功。" -ForegroundColor Green
        $report += "$name : 成功"
    } else {
        Write-Host "$name 推送失败：" -ForegroundColor Red
        ($out | Select-Object -Last 4) | ForEach-Object { Write-Host "  $_" -ForegroundColor DarkGray }
        $report += "$name : 失败（$name 网络或凭据问题）"
    }
}

Write-Host ""
Write-Host "=== 结果 ===" -ForegroundColor Cyan
$report | ForEach-Object { Write-Host "  $_" }
Write-Host ""
Write-Host "GitHub Pages : https://lisis0423.github.io/grade7-knowledge-quiz/"
Write-Host "AtomGit Pages: https://lisis0423.atomgit.net/grade7-knowledge-quiz/  （若平台未开放 Pages，可忽略）"
Write-Host ""

if (-not $NoPause) { Read-Host "按回车退出" }