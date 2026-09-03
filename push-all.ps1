#!/usr/bin/env pwsh
# push-all.ps1 - Stage all project changes and push to remote

Set-Location "c:\Users\Vikash\.gemini\antigravity-ide\scratch\ahmedabad-street-eats"

Write-Host "==> Staging image files..."
Get-ChildItem -Path "public\images\food" -Filter "*.jpeg" | ForEach-Object {
    $relativePath = $_.FullName.Replace("c:\Users\Vikash\.gemini\antigravity-ide\scratch\ahmedabad-street-eats\", "").Replace("\", "/")
    git add $relativePath
    Write-Host "  Added: $relativePath"
}

Write-Host "==> Staging code changes..."
git add "src/constants/food-images.ts"
git add "src/lib/prisma.ts"
git add "src/services/vendor.server.ts"
git add "src/app/api/vendors/route.ts"
git add "src/app/(public)/page.tsx"
git add "src/app/(public)/add/AddVendorForm.tsx"
git add "src/app/(admin)/layout.tsx"
git add "src/app/api/vendors/[id]/route.ts"

Write-Host "==> Git status..."
git status --short

Write-Host "==> Committing..."
git commit -m "feat: add local food images and fix admin caching + duplicate vendor review"

Write-Host "==> Pushing to remote..."
git push

Write-Host "==> DONE! Check Vercel for deployment."
