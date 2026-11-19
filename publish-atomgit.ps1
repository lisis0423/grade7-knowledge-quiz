# 把本项目再推一份到 AtomGit（开放原子开源基金会代码托管平台）
# 用法：双击 publish-atomgit.bat，或在本目录运行：
#   powershell -ExecutionPolicy Bypass -File .\publish-atomgit.ps1
#   powershell -ExecutionPolicy Bypass -File .\publish-atomgit.ps1 -User 你的AtomGit用户名

param(
    [string]$User = '',
    [string]$Repo = 'grade7-knowledge-quiz'
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

function Write-Step($text) { Write-Host $text -ForegroundColor Cyan }
function Write-Hint($text) { Write-Host $text -ForegroundColor DarkGray }

if (-not $User) {
    Write-Host ""
    Write-Host "AtomGit 用户名（例如 lisis0423，直接回车用默认值）:" -ForegroundColor Yellow
    $input = Read-Host "用户名"
    if ($input) { $User = $input.Trim() } else { $User = 'lisis0423' }
}

$remoteName = 'atomgit'
$remoteUrl = "https://atomgit.com/$User/$Repo.git"
$pagesUrl = "https://$User.atomgit.net/$Repo/"

Write-Host ""
Write-Step "=== 同步到 AtomGit ==="
Write-Host "仓库地址: $remoteUrl"
Write-Host "预期站点: $pagesUrl"
Write-Host ""

# --- 1. 本地提交（有改动才提交） ---------------------------------------
if (-not (Test-Path '.git')) {
    Write-Step "初始化本地仓库..."
    git init -b main | Out-Null
}

git add -A
if (git status --porcelain) {
    Write-Step "提交本地改动..."
    git commit -m "update: content" | Out-Null
}

# --- 2. 远端 ------------------------------------------------------------
$remotes = git remote
if ($remotes -notcontains $remoteName) {
    Write-Step "添加远端 $remoteName ..."
    git remote add $remoteName $remoteUrl
} else {
    git remote set-url $remoteName $remoteUrl
}

# --- 3. 先确认仓库存在，避免认证弹窗白等 --------------------------------
Write-Step "检查 AtomGit 上的仓库..."
$previous = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
$probe = git ls-remote --heads $remoteName 2>&1
$probeOk = ($LASTEXITCODE -eq 0)
$ErrorActionPreference = $previous
if (-not $probeOk) {
    Write-Host ""
    Write-Host "AtomGit 上还没有这个仓库（或没有权限）。" -ForegroundColor Red
    Write-Host ""
    Write-Host "先在 AtomGit 建一个空仓库（公开，不要勾选初始化 README）:"
    Write-Host "  https://atomgit.com/create/repo?name=$Repo"
    Write-Host "  或：https://atomgit.com  右上角 + → 新建仓库"
    Write-Host ""
    Write-Host "也可以试试用导入功能，直接从 GitHub 拉取已有内容："
    Write-Host "  https://atomgit.com/create/repo?type=import"
    Write-Host ""
    Write-Host "建好后重新运行本脚本即可。"
    Write-Host ""
    Read-Host "按回车退出"
    exit 1
}

# --- 4. 推送 ------------------------------------------------------------
Write-Step "推送到 AtomGit ..."
Write-Hint "第一次推送会要求登录：用户名填 AtomGit 账号，密码填「个人访问令牌」（不是登录密码）。"
Write-Hint "令牌在 https://atomgit.com/setting/token 生成，勾选 repo 权限。"
Write-Host ""

git push -u $remoteName main

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "推送失败。" -ForegroundColor Red
    Write-Host "若是 403 / Authentication failed：密码位置要填个人访问令牌；"
    Write-Host "若是 Connection was reset：网络问题，重试或换网络（手机热点）。"
    Write-Host ""
    Read-Host "按回车退出"
    exit 1
}

Write-Host ""
Write-Host "推送成功。" -ForegroundColor Green
Write-Host ""
Write-Step "接下来开启 AtomGit Pages（可选）"
Write-Host "  1) 打开 $remoteUrl/settings/pages"
Write-Host "  2) 若平台提供 Pages 应用，安装后选择 main 分支、根目录"
Write-Host "  3) 站点地址: $pagesUrl"
Write-Host ""
Write-Hint "说明：AtomGit 的 Pages 功能曾暂停，若设置页没有 Pages 入口，"
Write-Hint "代码托管仍然可用，网页版游戏继续用 GitHub Pages 的地址访问。"
Write-Host ""
Read-Host "按回车退出"