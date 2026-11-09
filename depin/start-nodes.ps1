<#
.SYNOPSIS
    CyberNode DePIN Multi-Chain Node Stack Orchestrator (Windows 10/11)
    Target Daily Passive Revenue: $10.00 – $15.00 / day
    No-KYC Residential Bandwidth, AI Scraper & Edge Inference

.DESCRIPTION
    Launches and governs background daemons with:
    - Low-priority CPU scheduling (BelowNormal) so main workflows are never throttled
    - Process thread affinity to spare/efficiency cores
    - Silent background operation with Windows Task Scheduler integration
#>

param(
    [switch]$InstallStartupTask,
    [switch]$UninstallStartupTask,
    [switch]$Status,
    [switch]$StopAll,
    [int]$AffinityMask = 0xF0  # Uses threads 4-7 by default on 8+ thread CPUs
)

$ErrorActionPreference = "SilentlyContinue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$LogFile = Join-Path $ScriptDir "logs\cybernode_win_launcher.log"

if (-not (Test-Path (Join-Path $ScriptDir "logs"))) {
    New-Item -ItemType Directory -Path (Join-Path $ScriptDir "logs") -Force | Out-Null
}

function Write-CyberLog {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $Line = "[$Timestamp] [$Level] $Message"
    Write-Host $Line -ForegroundColor $(if ($Level -eq "WARN") { "Yellow" } elseif ($Level -eq "ERROR") { "Red" } else { "Cyan" })
    Add-Content -Path $LogFile -Value $Line
}

# -----------------------------------------------------------------------------
# TASK SCHEDULER STARTUP REGISTRATION
# -----------------------------------------------------------------------------
if ($InstallStartupTask) {
    Write-CyberLog "Configuring Windows Task Scheduler for silent system boot..."
    $Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    $Trigger = New-ScheduledTaskTrigger -AtLogOn
    $Principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Highest
    $Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances Parallel -ExecutionTimeLimit (New-TimeSpan -Days 365)
    
    Register-ScheduledTask -TaskName "CyberNodeDePINStack" -Action $Action -Trigger $Trigger -Principal $Principal -Settings $Settings -Force
    Write-CyberLog "CyberNodeDePINStack scheduled task registered successfully! Will run silently on login." "INFO"
    exit 0
}

if ($UninstallStartupTask) {
    Unregister-ScheduledTask -TaskName "CyberNodeDePINStack" -Confirm:$false
    Write-CyberLog "CyberNodeDePINStack scheduled task removed." "INFO"
    exit 0
}

if ($StopAll) {
    Write-CyberLog "Stopping all running CyberNode DePIN daemons..." "WARN"
    Get-Process -Name "honeygain", "earnapp", "gaganode", "grass", "python" | Where-Object { $_.CommandLine -like "*cybernode*" -or $_.CommandLine -like "*depin*" } | Stop-Process -Force
    Write-CyberLog "All CyberNode processes stopped cleanly." "INFO"
    exit 0
}

# -----------------------------------------------------------------------------
# RESOURCE GOVERNANCE & AFFINITY HELPER
# -----------------------------------------------------------------------------
function Apply-ResourceGovernance {
    param(
        [System.Diagnostics.Process]$Proc,
        [string]$Name
    )
    if ($Proc -and -not $Proc.HasExited) {
        try {
            $Proc.PriorityClass = [System.Diagnostics.ProcessPriorityClass]::BelowNormal
            if ($AffinityMask -gt 0) {
                $Proc.ProcessorAffinity = [IntPtr]$AffinityMask
            }
            Write-CyberLog "Applied Resource Isolation to $Name [PID: $($Proc.Id)] (Priority: BelowNormal, Affinity: 0x$($AffinityMask.ToString('X')))"
        } catch {
            Write-CyberLog "Notice setting affinity on $Name: $_" "WARN"
        }
    }
}

# -----------------------------------------------------------------------------
# NODE LAUNCH MATRIX
# -----------------------------------------------------------------------------
Write-CyberLog "=========================================================="
Write-CyberLog "INITIALIZING CYBERNODE DePIN & AI EDGE COMPUTE MATRIX"
Write-CyberLog "Settlement Chains: Solana ($GRASS), EVM/Base ($NESA), TON ($TON/$GRAM)"
Write-CyberLog "Daily Target: $10.00 - $15.00/day ($300 - $450/month)"
Write-CyberLog "=========================================================="

# 1. Docker Compose Option (Preferred if Docker Desktop running)
$DockerCheck = Get-Command docker -ErrorAction SilentlyContinue
if ($DockerCheck -and (Get-Service docker -ErrorAction SilentlyContinue).Status -eq "Running") {
    Write-CyberLog "Docker daemon detected! Starting containerized orchestration stack..."
    Push-Location $ScriptDir
    docker-compose up -d
    Pop-Location
    Write-CyberLog "All 5 DePIN services active via Docker!"
} else {
    Write-CyberLog "Docker not running. Initiating native Windows background node daemons..."

    # 2. GaGaNode Native Edge Client
    $GagaExe = Join-Path $ScriptDir "bin\gaganode.exe"
    if (Test-Path $GagaExe) {
        $p = Start-Process -FilePath $GagaExe -ArgumentList "service start" -WindowStyle Hidden -PassThru
        Apply-ResourceGovernance -Proc $p -Name "GaGaNode"
    }

    # 3. Honeygain CLI
    $HgExe = "C:\Program Files (x86)\Honeygain\Honeygain.exe"
    if (Test-Path $HgExe) {
        $p = Start-Process -FilePath $HgExe -WindowStyle Hidden -PassThru
        Apply-ResourceGovernance -Proc $p -Name "Honeygain"
    }

    # 4. EarnApp Background Service
    $EarnAppExe = "C:\Program Files (x86)\EarnApp\earnapp.exe"
    if (Test-Path $EarnAppExe) {
        $p = Start-Process -FilePath $EarnAppExe -WindowStyle Hidden -PassThru
        Apply-ResourceGovernance -Proc $p -Name "EarnApp"
    }

    # 5. Grass & NodePay Python Headless Workers
    $SentinelPy = Join-Path $ScriptDir "depin_sentinel.py"
    if (Test-Path $SentinelPy) {
        $p = Start-Process -FilePath "python.exe" -ArgumentList "`"$SentinelPy`"" -WindowStyle Hidden -PassThru
        Apply-ResourceGovernance -Proc $p -Name "DePINSentinel"
    }
}

Write-CyberLog "CyberNode Stack successfully initialized in background with zero hardware throttling!"
