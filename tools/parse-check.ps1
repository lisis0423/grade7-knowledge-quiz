$errs = @()
[void][System.Management.Automation.Language.Parser]::ParseFile((Resolve-Path $args[0]).Path, [ref]$null, [ref]$errs)
if ($errs.Count -eq 0) { Write-Output 'PARSE OK' } else { $errs | ForEach-Object { Write-Output $_.Message } }