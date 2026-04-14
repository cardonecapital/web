$replacements = @(
    @{ pattern = 'src="[^"]*(?:cc-logo(?:-white)?\.svg|logocc\.png)"'; replacement = 'src="/assets/images/logocc.png"' },
    @{ pattern = "src='[^']*(?:cc-logo(?:-white)?\.svg|logocc\.png)'"; replacement = "src='/assets/images/logocc.png'" }
)

Get-ChildItem -Path . -Recurse -Filter *.html | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $newContent = $content
    foreach ($item in $replacements) {
        $newContent = $newContent -replace $item.pattern, $item.replacement
    }
    if ($newContent -ne $content) {
        Set-Content $_.FullName $newContent
        Write-Host "Updated: $($_.FullName)"
    }
}
