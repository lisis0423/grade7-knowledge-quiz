# 检查本地与 GitHub / AtomGit 是否同步
# 用法：双击 check-remotes.bat

param([switch]$NoPause)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$remotes = @(
    @{ name = 'GitHub';  remote = 'origin' },
    @{ name = 'AtomGit'; remote = 'atomgit' }
)

$localSha = (git rev-parse HEAD).Trim()
$branch = (git rev-parse --abbrev-ref HEAD).Trim()
$localShort = $localSha.Substring(0, 7)

Write-Host ""
Write-Host "=== 版本同步检查 ===" -ForegroundColor Cyan
Write-Host "本地 $branch : $localShort"
Write-Host ""

$allOk = $true

foreach ($r in $remotes) {
    $name = $r.name
    $remote = $r.remote

    # 远端是否存在
    $prev = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    $hasRemote = (git remote | Where-Object { $_ -eq $remote })
    if (-not $hasRemote) {
        $ErrorActionPreference = $prev
        Write-Host "$name : 没有配置 $remote 远端" -ForegroundColor Yellow
        $allOk = $false
        continue
    }

    $oldPrompt = $env:GIT_TERMINAL_PROMPT
    $env:GIT_TERMINAL_PROMPT = '0'
    $heads = git -c credential.helper= ls-remote --heads $remote "refs/heads/$branch" 2>&1
    $code = $LASTEXITCODE
    if ($null -eq $oldPrompt) { Remove-Item Env:\GIT_TERMINAL_PROMPT -ErrorAction SilentlyContinue } else { $env:GIT_TERMINAL_PROMPT = $oldPrompt }
    $ErrorActionPreference = $prev

    if ($code -ne 0 -or -not $heads) {
        Write-Host "$name : 无法访问（网络不通，或仓库还没建）" -ForegroundColor Yellow
        $allOk = $false
        continue
    }

    $remoteSha = (($heads -split "\s+")[0]).Trim()
    $remoteShort = $remoteSha.Substring(0, 7)

    if ($remoteSha -eq $localSha) {
        Write-Host "$name : 已是最新（$remoteShort）" -ForegroundColor Green
        continue
    }

    # 取回远端分支后再算差多少
    $prev = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    git fetch --quiet $remote $branch 2>&1 | Out-Null
    $fetchOk = ($LASTEXITCODE -eq 0)
    $ErrorActionPreference = $prev

    $ahead = 0
    $behind = 0
    if ($fetchOk) {
        # ahead = 本地比远端多几个提交；behind = 远端比本地多几个
        $ahead = [int](git rev-list --count "FETCH_HEAD..$localSha" 2>$null)
        $behind = [int](git rev-list --count "$localSha..FETCH_HEAD" 2>$null)
    }

    if ($ahead -gt 0 -and $behind -eq 0) {
        Write-Host "$name : 落后 $ahead 个提交（需要推送）远端=$remoteShort 本地=$localShort" -ForegroundColor Yellow
        $allOk = $false
    } elseif ($behind -gt 0 -and $ahead -eq 0) {
        Write-Host "$name : 领先 $behind 个提交（需要拉取）远端=$remoteShort 本地=$localShort" -ForegroundColor Yellow
        $allOk = $false
    } elseif ($ahead -gt 0 -and $behind -gt 0) {
        Write-Host "$name : 已分叉（本地多 $ahead，远端多 $behind）远端=$remoteShort 本地=$localShort" -ForegroundColor Red
        $allOk = $false
    } else {
        Write-Host "$name : 提交不同，建议 fetch 后检查（远端=$remoteShort 本地=$localShort）" -ForegroundColor Yellow
        $allOk = $false
    }
}

Write-Host ""
if ($allOk) {
    Write-Host "结论：两个平台都是最新版本。" -ForegroundColor Green
    Write-Host "  GitHub Pages : https://lisis0423.github.io/grade7-knowledge-quiz/"
    Write-Host "  AtomGit      : https://atomgit.com/lisis0423/grade7-knowledge-quiz"
} else {
    Write-Host "结论：有平台不是最新，双击 sync-remotes.bat 可以一次推两个平台。" -ForegroundColor Yellow
}
Write-Host ""

if (-not $NoPause) { Read-Host "按回车退出" }