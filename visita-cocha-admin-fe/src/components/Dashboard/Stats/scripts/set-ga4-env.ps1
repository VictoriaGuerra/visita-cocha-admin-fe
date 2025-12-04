<#
  PowerShell helper to export GA4 / server env vars for the current session.
  Usage (PowerShell):
    .\scripts\set-ga4-env.ps1

  Replace the placeholder values below before running, or run the script
  and manually set the variables after.
#>

param(
  [Parameter(Mandatory=$false)][string] $Path = "C:\keys\cocha-turismo-39a7d0fbf54e.json",
  [Parameter(Mandatory=$false)][string] $PropertyId = "properties/REPLACE_WITH_YOUR_PROPERTY_ID",
  [Parameter(Mandatory=$false)][string] $DepartmentDim = "",
  [Parameter(Mandatory=$false)][switch] $Persist
)

function Show-Help {
  Write-Host "Usage:"
  Write-Host "  # Temporary for current session (dot-source to persist in current session):"
  Write-Host "  . .\scripts\set-ga4-env.ps1 -Path 'C:\keys\your-file.json' -PropertyId 'properties/123'"
  Write-Host ""
  Write-Host "  # Persist environment variables for current user (uses setx):"
  Write-Host "  .\scripts\set-ga4-env.ps1 -Path 'C:\keys\your-file.json' -PropertyId 'properties/123' -Persist"
}

if ($Path -eq "" -or $PropertyId -eq "") {
  Show-Help
  return
}

if (-not (Test-Path $Path)) {
  Write-Host "Error: credentials file not found at: $Path" -ForegroundColor Red
  return
}

Write-Host "Configuring GA4 environment variables..."

# For temporary session variables (effective if you dot-source the script):
$env:GOOGLE_APPLICATION_CREDENTIALS = $Path
$env:GA4_PROPERTY_ID = $PropertyId
if ($DepartmentDim -ne "") { $env:GA4_DEPARTMENT_DIMENSION = $DepartmentDim }

Write-Host "GOOGLE_APPLICATION_CREDENTIALS set to: $env:GOOGLE_APPLICATION_CREDENTIALS"
Write-Host "GA4_PROPERTY_ID set to: $env:GA4_PROPERTY_ID"
if ($DepartmentDim -ne "") { Write-Host "GA4_DEPARTMENT_DIMENSION set to: $env:GA4_DEPARTMENT_DIMENSION" }

if ($Persist) {
  Write-Host "Persisting variables to user environment (setx)"
  setx GOOGLE_APPLICATION_CREDENTIALS "$Path" | Out-Null
  setx GA4_PROPERTY_ID "$PropertyId" | Out-Null
  if ($DepartmentDim -ne "") { setx GA4_DEPARTMENT_DIMENSION "$DepartmentDim" | Out-Null }
  Write-Host "Persisted. You may need to restart your terminal for new vars to be available." -ForegroundColor Yellow
} else {
  Write-Host "Variables set for this session only. To make them active in your current shell, dot-source this script:" -ForegroundColor Green
  Write-Host ". .\scripts\set-ga4-env.ps1 -Path '$Path' -PropertyId '$PropertyId'" -ForegroundColor Cyan
}

Write-Host "Done." -ForegroundColor Green
