# PowerShell script to ensure every page uses the approved transparent logo PNG

$pattern = 'src="/img/cc-logo-white\.svg"'
$replacement = 'src="/assets/images/logocc.png"'

Get-ChildItem -Path . -Filter *.html -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $newContent = $content -replace $pattern, $replacement
    if ($newContent -ne $content) {
        Set-Content $_.FullName $newContent
        Write-Host "Updated: $($_.FullName)"
    }
}