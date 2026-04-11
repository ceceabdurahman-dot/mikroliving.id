$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$artifactRoot = Join-Path $repoRoot 'migration_artifacts'

$packageJsonPath = Join-Path $repoRoot 'package.json'
$packageJson = Get-Content -LiteralPath $packageJsonPath -Raw | ConvertFrom-Json
$dateStamp = Get-Date -Format 'yyyy-MM-dd'

$rootEnvPath = Join-Path $repoRoot '.env'
$rootEnv = @{}
if (Test-Path $rootEnvPath) {
    foreach ($rawLine in Get-Content -LiteralPath $rootEnvPath) {
        $line = $rawLine.Trim()
        if (-not $line -or $line.StartsWith('#')) {
            continue
        }

        $separatorIndex = $line.IndexOf('=')
        if ($separatorIndex -lt 0) {
            continue
        }

        $key = $line.Substring(0, $separatorIndex).Trim()
        $value = $line.Substring($separatorIndex + 1).Trim()

        if (
            ($value.StartsWith('"') -and $value.EndsWith('"')) -or
            ($value.StartsWith("'") -and $value.EndsWith("'"))
        ) {
            $value = $value.Substring(1, $value.Length - 2)
        }

        $rootEnv[$key] = $value
    }
}

function Get-ProcessEnvValue {
    param(
        [string[]]$Names,
        [string]$DefaultValue = ''
    )

    foreach ($name in $Names) {
        $processValue = [Environment]::GetEnvironmentVariable($name)
        if (-not [string]::IsNullOrWhiteSpace($processValue)) {
            return $processValue
        }
    }

    return $DefaultValue
}

function Get-RootEnvValue {
    param(
        [string[]]$Names,
        [string]$DefaultValue = ''
    )

    foreach ($name in $Names) {
        if ($rootEnv.ContainsKey($name) -and -not [string]::IsNullOrWhiteSpace($rootEnv[$name])) {
            return $rootEnv[$name]
        }
    }

    return $DefaultValue
}

function Get-ConfigValue {
    param(
        [string[]]$ProcessNames,
        [string[]]$RootNames = @(),
        [string]$DefaultValue = ''
    )

    $processValue = Get-ProcessEnvValue -Names $ProcessNames
    if (-not [string]::IsNullOrWhiteSpace($processValue)) {
        return $processValue
    }

    $rootValue = Get-RootEnvValue -Names $RootNames
    if (-not [string]::IsNullOrWhiteSpace($rootValue)) {
        return $rootValue
    }

    return $DefaultValue
}

function Get-SafeArtifactName {
    param(
        [string]$Value,
        [string]$DefaultValue = 'app'
    )

    $cleanValue = ($Value -replace '[^a-zA-Z0-9._-]+', '-').Trim('-', '.')
    if ([string]::IsNullOrWhiteSpace($cleanValue)) {
        return $DefaultValue
    }

    return $cleanValue
}

function Format-EnvLine {
    param(
        [string]$Key,
        [string]$Value
    )

    $safeValue = if ($null -eq $Value) { '' } else { $Value.Replace('"', '\"') }
    return '{0}="{1}"' -f $Key, $safeValue
}

function Copy-RequiredItem {
    param(
        [string]$SourceRelativePath,
        [string]$DestinationRelativePath
    )

    $sourcePath = Join-Path $repoRoot $SourceRelativePath
    if (-not (Test-Path $sourcePath)) {
        throw "Missing required file or folder: $SourceRelativePath"
    }

    $destinationPath = Join-Path $script:uploadDir $DestinationRelativePath
    $destinationParent = Split-Path -Parent $destinationPath
    if ($destinationParent) {
        New-Item -ItemType Directory -Path $destinationParent -Force | Out-Null
    }

    Copy-Item -LiteralPath $sourcePath -Destination $destinationPath -Recurse -Force
}

function Copy-OptionalItem {
    param(
        [string]$SourceRelativePath,
        [string]$DestinationRelativePath
    )

    $sourcePath = Join-Path $repoRoot $SourceRelativePath
    if (-not (Test-Path $sourcePath)) {
        return
    }

    $destinationPath = Join-Path $script:uploadDir $DestinationRelativePath
    $destinationParent = Split-Path -Parent $destinationPath
    if ($destinationParent) {
        New-Item -ItemType Directory -Path $destinationParent -Force | Out-Null
    }

    Copy-Item -LiteralPath $sourcePath -Destination $destinationPath -Recurse -Force
}

$requestedAppName = Get-ConfigValue -ProcessNames @('APP_NAME') -DefaultValue $packageJson.name
$appName = Get-SafeArtifactName -Value $requestedAppName -DefaultValue 'app'

$sourceDbHost = Get-ConfigValue -ProcessNames @('SOURCE_DB_HOST') -RootNames @('DB_HOST') -DefaultValue '127.0.0.1'
$sourceDbPort = Get-ConfigValue -ProcessNames @('SOURCE_DB_PORT') -RootNames @('DB_PORT') -DefaultValue '3306'
$sourceDbUser = Get-ConfigValue -ProcessNames @('SOURCE_DB_USER') -RootNames @('DB_USER', 'DB_USERNAME') -DefaultValue 'root'
$sourceDbPassword = Get-ConfigValue -ProcessNames @('SOURCE_DB_PASSWORD') -RootNames @('DB_PASSWORD') -DefaultValue ''
$sourceDbName = Get-ConfigValue -ProcessNames @('SOURCE_DB_NAME') -RootNames @('DB_NAME', 'DB_DATABASE') -DefaultValue $packageJson.name

$targetDbHost = Get-ProcessEnvValue -Names @('DB_HOST') -DefaultValue 'replace_with_database_host'
$targetDbPort = Get-ProcessEnvValue -Names @('DB_PORT') -DefaultValue '3306'
$targetDbUser = Get-ProcessEnvValue -Names @('DB_USERNAME', 'DB_USER') -DefaultValue 'replace_with_database_user'
$targetDbPassword = Get-ProcessEnvValue -Names @('DB_PASSWORD') -DefaultValue 'replace_with_database_password'
$targetDbName = Get-ProcessEnvValue -Names @('DB_DATABASE', 'DB_NAME') -DefaultValue $sourceDbName
$targetPort = Get-ProcessEnvValue -Names @('PORT') -DefaultValue '3000'
$targetJwtSecret = Get-ProcessEnvValue -Names @('JWT_SECRET') -DefaultValue 'replace-with-a-long-random-secret'
$targetGeminiApiKey = Get-ProcessEnvValue -Names @('GEMINI_API_KEY') -DefaultValue ''
$targetCloudinaryCloud = Get-ProcessEnvValue -Names @('CLOUDINARY_CLOUD_NAME') -DefaultValue 'replace_with_cloudinary_cloud_name'
$targetCloudinaryKey = Get-ProcessEnvValue -Names @('CLOUDINARY_API_KEY') -DefaultValue 'replace_with_cloudinary_api_key'
$targetCloudinarySecret = Get-ProcessEnvValue -Names @('CLOUDINARY_API_SECRET') -DefaultValue 'replace_with_cloudinary_api_secret'
$targetLogInfoFile = Get-ProcessEnvValue -Names @('LOG_INFO_FILE') -DefaultValue './logs/app-info.log'
$targetLogErrorFile = Get-ProcessEnvValue -Names @('LOG_ERROR_FILE') -DefaultValue './logs/app-error.log'
$targetLogMaxSize = Get-ProcessEnvValue -Names @('LOG_MAX_SIZE_MB') -DefaultValue '10'
$targetLogMaxFiles = Get-ProcessEnvValue -Names @('LOG_MAX_FILES') -DefaultValue '5'
$targetLogServiceName = Get-ProcessEnvValue -Names @('LOG_SERVICE_NAME') -DefaultValue $appName
$rateLimitAdminLoginWindow = Get-ProcessEnvValue -Names @('RATE_LIMIT_ADMIN_LOGIN_WINDOW_MS') -DefaultValue '900000'
$rateLimitAdminLoginMax = Get-ProcessEnvValue -Names @('RATE_LIMIT_ADMIN_LOGIN_MAX') -DefaultValue '5'
$rateLimitAdminWriteWindow = Get-ProcessEnvValue -Names @('RATE_LIMIT_ADMIN_WRITE_WINDOW_MS') -DefaultValue '300000'
$rateLimitAdminWriteMax = Get-ProcessEnvValue -Names @('RATE_LIMIT_ADMIN_WRITE_MAX') -DefaultValue '30'
$rateLimitAdminUploadWindow = Get-ProcessEnvValue -Names @('RATE_LIMIT_ADMIN_UPLOAD_WINDOW_MS') -DefaultValue '600000'
$rateLimitAdminUploadMax = Get-ProcessEnvValue -Names @('RATE_LIMIT_ADMIN_UPLOAD_MAX') -DefaultValue '10'
$rateLimitContactWindow = Get-ProcessEnvValue -Names @('RATE_LIMIT_CONTACT_WINDOW_MS') -DefaultValue '600000'
$rateLimitContactMax = Get-ProcessEnvValue -Names @('RATE_LIMIT_CONTACT_MAX') -DefaultValue '5'

$uploadDirName = "$appName`_hostinger_node_$dateStamp"
$script:uploadDir = Join-Path $artifactRoot $uploadDirName
$uploadZipPath = Join-Path $artifactRoot "$uploadDirName.zip"
$sqlDumpPath = Join-Path $artifactRoot "$appName`_database_$dateStamp.sql"
$sqlSchemaPath = Join-Path $artifactRoot "$appName`_database_schema_$dateStamp.sql"
$manifestPath = Join-Path $artifactRoot "$appName`_deployment_manifest_$dateStamp.json"
$targetEnvPath = Join-Path $artifactRoot "$appName`_hostinger_env_$dateStamp.env"

foreach ($pathToRemove in @($script:uploadDir, $uploadZipPath, $sqlDumpPath, $sqlSchemaPath, $manifestPath, $targetEnvPath)) {
    if (Test-Path $pathToRemove) {
        Remove-Item -LiteralPath $pathToRemove -Recurse -Force
    }
}

New-Item -ItemType Directory -Path $script:uploadDir -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $script:uploadDir 'logs') -Force | Out-Null
Set-Content -LiteralPath (Join-Path $script:uploadDir 'logs\.gitkeep') -Value '' -Encoding UTF8

Copy-RequiredItem -SourceRelativePath 'build' -DestinationRelativePath 'build'
Copy-RequiredItem -SourceRelativePath 'dist' -DestinationRelativePath 'dist'
Copy-RequiredItem -SourceRelativePath 'README.md' -DestinationRelativePath 'README.md'
Copy-RequiredItem -SourceRelativePath 'deploy\HOSTINGER_NODEJS.md' -DestinationRelativePath 'deploy\HOSTINGER_NODEJS.md'
Copy-RequiredItem -SourceRelativePath 'deploy\observability' -DestinationRelativePath 'deploy\observability'
Copy-RequiredItem -SourceRelativePath 'deploy\hostinger.nodejs-upload.env.example' -DestinationRelativePath 'HOSTINGER_ENV.example'
Copy-OptionalItem -SourceRelativePath 'ecosystem.config.cjs' -DestinationRelativePath 'ecosystem.config.cjs'
Copy-OptionalItem -SourceRelativePath 'package-lock.json' -DestinationRelativePath 'package-lock.json'
Copy-OptionalItem -SourceRelativePath '.env.example' -DestinationRelativePath 'LOCAL_ENV_REFERENCE.example'

$runtimePackageJson = [ordered]@{
    name = $packageJson.name
    private = $true
    version = $packageJson.version
    type = $packageJson.type
    engines = $packageJson.engines
    scripts = @{
        start = $packageJson.scripts.start
    }
    dependencies = $packageJson.dependencies
}

$runtimePackageJson |
    ConvertTo-Json -Depth 20 |
    Set-Content -LiteralPath (Join-Path $script:uploadDir 'package.json') -Encoding UTF8

$targetEnvLines = @(
    '# Generated deployment environment values'
    "# Artifact name: $requestedAppName"
    ''
    (Format-EnvLine -Key 'PORT' -Value $targetPort)
    (Format-EnvLine -Key 'JWT_SECRET' -Value $targetJwtSecret)
    (Format-EnvLine -Key 'GEMINI_API_KEY' -Value $targetGeminiApiKey)
    ''
    '# Database'
    (Format-EnvLine -Key 'DB_HOST' -Value $targetDbHost)
    (Format-EnvLine -Key 'DB_PORT' -Value $targetDbPort)
    (Format-EnvLine -Key 'DB_USER' -Value $targetDbUser)
    (Format-EnvLine -Key 'DB_PASSWORD' -Value $targetDbPassword)
    (Format-EnvLine -Key 'DB_NAME' -Value $targetDbName)
    ''
    '# Cloudinary'
    (Format-EnvLine -Key 'CLOUDINARY_CLOUD_NAME' -Value $targetCloudinaryCloud)
    (Format-EnvLine -Key 'CLOUDINARY_API_KEY' -Value $targetCloudinaryKey)
    (Format-EnvLine -Key 'CLOUDINARY_API_SECRET' -Value $targetCloudinarySecret)
    ''
    '# Optional logging'
    (Format-EnvLine -Key 'LOG_INFO_FILE' -Value $targetLogInfoFile)
    (Format-EnvLine -Key 'LOG_ERROR_FILE' -Value $targetLogErrorFile)
    (Format-EnvLine -Key 'LOG_MAX_SIZE_MB' -Value $targetLogMaxSize)
    (Format-EnvLine -Key 'LOG_MAX_FILES' -Value $targetLogMaxFiles)
    (Format-EnvLine -Key 'LOG_SERVICE_NAME' -Value $targetLogServiceName)
    ''
    '# Optional rate-limit tuning'
    (Format-EnvLine -Key 'RATE_LIMIT_ADMIN_LOGIN_WINDOW_MS' -Value $rateLimitAdminLoginWindow)
    (Format-EnvLine -Key 'RATE_LIMIT_ADMIN_LOGIN_MAX' -Value $rateLimitAdminLoginMax)
    (Format-EnvLine -Key 'RATE_LIMIT_ADMIN_WRITE_WINDOW_MS' -Value $rateLimitAdminWriteWindow)
    (Format-EnvLine -Key 'RATE_LIMIT_ADMIN_WRITE_MAX' -Value $rateLimitAdminWriteMax)
    (Format-EnvLine -Key 'RATE_LIMIT_ADMIN_UPLOAD_WINDOW_MS' -Value $rateLimitAdminUploadWindow)
    (Format-EnvLine -Key 'RATE_LIMIT_ADMIN_UPLOAD_MAX' -Value $rateLimitAdminUploadMax)
    (Format-EnvLine -Key 'RATE_LIMIT_CONTACT_WINDOW_MS' -Value $rateLimitContactWindow)
    (Format-EnvLine -Key 'RATE_LIMIT_CONTACT_MAX' -Value $rateLimitContactMax)
)

Set-Content -LiteralPath $targetEnvPath -Value $targetEnvLines -Encoding UTF8
Set-Content -LiteralPath (Join-Path $script:uploadDir 'HOSTINGER_ENV.ready') -Value $targetEnvLines -Encoding UTF8

$schemaSource = Get-Content -LiteralPath (Join-Path $repoRoot 'schema.sql')
$filteredSchema = $schemaSource | Where-Object {
    $_ -notmatch '^\s*CREATE DATABASE IF NOT EXISTS ' -and
    $_ -notmatch '^\s*USE '
}

$schemaSqlContent = @(
    '-- Schema-only deployment SQL package'
    "-- Suggested target database name: $targetDbName"
    "-- Local source database reference: $sourceDbName"
    '-- Import this file into the target database that you created in your hosting panel.'
    ''
) + $filteredSchema

Set-Content -LiteralPath $sqlSchemaPath -Value $schemaSqlContent -Encoding UTF8

$dumpCandidates = @()
if ($env:MYSQLDUMP_PATH) {
    $dumpCandidates += $env:MYSQLDUMP_PATH
}
$dumpCandidates += @(
    'E:\xampp\mysql\bin\mysqldump.exe',
    'C:\xampp\mysql\bin\mysqldump.exe'
) | Select-Object -Unique

$dumpStatus = 'fallback'
$dumpMessage = 'Live mysqldump could not be created automatically. Use the schema-only SQL file instead.'
$dumpErrors = @()

foreach ($candidate in $dumpCandidates) {
    if (-not (Test-Path $candidate)) {
        $dumpErrors += "${candidate}: not found"
        continue
    }

    $dumpArgs = @(
        '--single-transaction',
        '--skip-lock-tables',
        '--default-character-set=utf8mb4',
        "--host=$sourceDbHost",
        "--port=$sourceDbPort",
        "--user=$sourceDbUser"
    )

    if (-not [string]::IsNullOrEmpty($sourceDbPassword)) {
        $dumpArgs += "--password=$sourceDbPassword"
    }

    $dumpArgs += $sourceDbName

    try {
        $dumpOutput = & $candidate @dumpArgs 2>&1
        if ($LASTEXITCODE -eq 0 -and $dumpOutput) {
            Set-Content -LiteralPath $sqlDumpPath -Value $dumpOutput -Encoding UTF8
            $dumpStatus = 'dumped'
            $dumpMessage = "Database dump exported successfully with $candidate from local source database $sourceDbName."
            break
        }

        $dumpErrors += "${candidate}: $($dumpOutput | Out-String)"
    } catch {
        $dumpErrors += "${candidate}: $($_.Exception.Message)"
    }
}

if ($dumpStatus -ne 'dumped') {
    $fallbackDump = @(
        '-- Live mysqldump could not be created automatically.'
        '-- Use the schema-only SQL file instead, or export the database manually from phpMyAdmin.'
    ) + ($dumpErrors | ForEach-Object { "-- $_" }) + @('')

    Set-Content -LiteralPath $sqlDumpPath -Value $fallbackDump -Encoding UTF8
}

$checklistLines = @(
    'NODE.JS UPLOAD CHECKLIST'
    ''
    'Framework note:'
    '- This package is for a Node.js runtime deployment of the current React + Vite + Express app.'
    '- It is not a migration to Next.js.'
    ''
    'Files generated:'
    "- $([IO.Path]::GetFileName($uploadZipPath))"
    "- $([IO.Path]::GetFileName($sqlDumpPath))"
    "- $([IO.Path]::GetFileName($sqlSchemaPath))"
    "- $([IO.Path]::GetFileName($targetEnvPath))"
    ''
    'Suggested hosting setup:'
    '- Node.js version: 22.x'
    '- Install command: npm install --omit=dev'
    '- Start command: npm start'
    '- Build command: not required, because this upload package already includes build and dist output.'
    ''
    'Database setup:'
    "- Create the target database first in your hosting panel. Target database name: $targetDbName"
    "- Local source dump origin: $sourceDbName"
    '- Deployment environment file: use HOSTINGER_ENV.ready inside the ZIP or the standalone generated env file.'
)

if ($dumpStatus -eq 'dumped') {
    $checklistLines += "- Import $([IO.Path]::GetFileName($sqlDumpPath)) if you want the current database content, or use $([IO.Path]::GetFileName($sqlSchemaPath)) for schema + seed structure only."
} else {
    $checklistLines += "- Live dump was not available automatically, so use $([IO.Path]::GetFileName($sqlSchemaPath)) after creating the target database manually."
}

$checklistLines += @(
    ''
    'Upload flow:'
    '- Upload the ZIP through the Node.js application or VPS file manager flow.'
    '- Extract the ZIP so package.json, build/, dist/, deploy/, and logs/ sit in the app root.'
    '- Copy HOSTINGER_ENV.ready into your production environment configuration or enter the same values in the hosting panel.'
    '- Start the app and verify /api/health, /, and /admin.'
    ''
)

Set-Content -LiteralPath (Join-Path $script:uploadDir 'UPLOAD_CHECKLIST.txt') -Value $checklistLines -Encoding UTF8

$itemsToZip = Get-ChildItem -Force -LiteralPath $script:uploadDir
if (-not $itemsToZip) {
    throw 'No deployment files were generated to archive.'
}

Compress-Archive -Path $itemsToZip.FullName -DestinationPath $uploadZipPath -Force

$manifest = [ordered]@{
    generatedAt = (Get-Date).ToString('o')
    repoRoot = $repoRoot
    appName = $requestedAppName
    artifactName = $appName
    uploadDirectory = $script:uploadDir
    uploadZip = $uploadZipPath
    databaseDump = $sqlDumpPath
    databaseSchema = $sqlSchemaPath
    targetEnvFile = $targetEnvPath
    dumpStatus = $dumpStatus
    dumpMessage = $dumpMessage
    sourceDatabase = [ordered]@{
        host = $sourceDbHost
        port = $sourceDbPort
        database = $sourceDbName
    }
    targetDatabase = [ordered]@{
        host = $targetDbHost
        port = $targetDbPort
        database = $targetDbName
    }
    notes = @(
        'This repo is a React + Vite + Express application deployed with a Node.js runtime.',
        'The generated upload package is for Node.js hosting, not a framework migration to Next.js.',
        'Target deployment secrets are written into the generated env file only and should not be committed to Git.'
    )
}

$manifest |
    ConvertTo-Json -Depth 20 |
    Set-Content -LiteralPath $manifestPath -Encoding UTF8

$manifest | ConvertTo-Json -Depth 20
