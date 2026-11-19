$log = Join-Path $PSScriptRoot 'step-trace.txt'
function T($m) { Add-Content -Path $log -Value ((Get-Date).ToString('HH:mm:ss.fff') + ' ' + $m) }
Set-Content -Path $log -Value 'start'
Set-Location (Split-Path $PSScriptRoot -Parent)
T ('pwd=' + (Get-Location).Path)
git add -A
T ('add done code=' + $LASTEXITCODE)
$s = git status --porcelain
T ('status lines=' + ($s | Measure-Object).Count)
git commit -m "update: content" | Out-Null
T ('commit done code=' + $LASTEXITCODE)
$previous = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
git -c credential.helper= ls-remote --heads atomgit 2>&1 | Out-Null
$code = $LASTEXITCODE
$ErrorActionPreference = $previous
T ('ls-remote code=' + $code)
T 'end'