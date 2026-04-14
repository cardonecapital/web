Get-ChildItem -Recurse -Filter *.html | Select-String -Pattern @('alt="Cardone Capital"','alt=''Cardone Capital''') | ForEach-Object {
    "$($_.Path):$($_.LineNumber):$($_.Line.Trim())"
}
