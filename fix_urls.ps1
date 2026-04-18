Get-ChildItem -Path "d:\AT2 PROJECT\frontend\src" -Recurse -Include *.jsx,*.js | ForEach-Object {
    $content = Get-Content $_.FullName -Raw

    # Fix 1: single-quoted broken URLs  ->  template literals with env var
    # e.g.  'import.meta.env.VITE_API_URL/api/foo'
    #    ->  `${import.meta.env.VITE_API_URL}/api/foo`
    $content = [regex]::Replace(
        $content,
        "'import\.meta\.env\.VITE_API_URL(/[^']*)'",
        '`$${import.meta.env.VITE_API_URL}$1`'
    )

    # Fix 2: bare env var inside an existing template literal (backtick string)
    # e.g.  `import.meta.env.VITE_API_URL/api/foo`
    #    ->  `${import.meta.env.VITE_API_URL}/api/foo`
    $content = $content -replace 'import\.meta\.env\.VITE_API_URL/', '$${import.meta.env.VITE_API_URL}/'

    Set-Content $_.FullName $content -NoNewline
}

Write-Host "Done fixing API URLs."
