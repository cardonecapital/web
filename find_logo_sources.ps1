$patterns = @('cc-logo-white\.svg','cc-logo\.svg','logocc\.png')
Get-ChildItem -Recurse -Filter *.html | Select-String -Pattern $patterns | ForEach-Object {
    "$($_.Path):$($_.LineNumber):$($_.Line.Trim())"
}
