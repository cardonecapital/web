$files = @(
    'academy\\index.html',
    'academy\\faq\\index.html',
    'contact\\index.html',
    'schedule\\index.html'
)

foreach ($f in $files) {
    Write-Host "Checking $f"
    Select-String -Path $f -Pattern 'src="/assets/images/logocc.png"','alt="Cardone Capital"' | ForEach-Object {
        Write-Host "$($_.Path):$($_.LineNumber):$($_.Line.Trim())"
    }
}
