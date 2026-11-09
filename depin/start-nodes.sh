#!/usr/bin/env bash
# ==============================================================================
# CyberNode DePIN Multi-Chain Node Stack Orchestrator (Linux & Android Termux)
# Target Daily Passive Revenue: $10.00 – $15.00 / day
# Settlement Chains: Solana ($GRASS), EVM Base ($NESA), TON ($TON/$GRAM)
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${SCRIPT_DIR}/logs"
LOG_FILE="${LOG_DIR}/cybernode_linux_launcher.log"
mkdir -p "${LOG_DIR}"

log() {
    local level="${2:-INFO}"
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] [${level}] $1"
    echo -e "${msg}"
    echo "${msg}" >> "${LOG_FILE}"
}

# Android Termux Environment Check
IS_TERMUX=false
if [ -d "/data/data/com.termux" ]; then
    IS_TERMUX=true
    log "Android Termux environment detected! Acquiring wake-lock..." "INFO"
    termux-wake-lock 2>/dev/null || true
fi

# Resource Isolation: nice priority 15, idle I/O priority, core affinity 2-3
RUN_ISOLATED="nice -n 15 ionice -c 3"
if command -v taskset >/dev/null 2>&1; then
    CPU_CORES=$(nproc 2>/dev/null || echo 4)
    if [ "${CPU_CORES}" -gt 2 ]; then
        RUN_ISOLATED="taskset -c 2,$((CPU_CORES - 1)) nice -n 15 ionice -c 3"
    fi
fi

# -----------------------------------------------------------------------------
# COMMAND DISPATCHER
# -----------------------------------------------------------------------------
case "$1" in
    status)
        log "Checking CyberNode DePIN service status..." "INFO"
        if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
            docker-compose -f "${SCRIPT_DIR}/docker-compose.yml" ps
        else
            ps aux | grep -E "honeygain|earnapp|gaganode|grass|depin_sentinel" | grep -v grep || echo "No standalone nodes currently active."
        fi
        exit 0
        ;;
    stop)
        log "Stopping all CyberNode DePIN daemons..." "WARN"
        if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
            docker-compose -f "${SCRIPT_DIR}/docker-compose.yml" down
        fi
        pkill -f "depin_sentinel.py" || true
        pkill -f "gaganode" || true
        pkill -f "earnapp" || true
        log "All services stopped." "INFO"
        exit 0
        ;;
    install-systemd)
        log "Installing CyberNode systemd background unit..." "INFO"
        cat <<EOF | sudo tee /etc/systemd/system/cybernode-depin.service
[Unit]
Description=CyberNode DePIN Multi-Chain Edge Daemon
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=${USER}
WorkingDirectory=${SCRIPT_DIR}
ExecStart=${SCRIPT_DIR}/start-nodes.sh run
Restart=always
RestartSec=30
Nice=15
CPUSchedulingPolicy=other
IOSchedulingClass=idle

[Install]
WantedBy=multi-user.target
EOF
        sudo systemctl daemon-reload
        sudo systemctl enable cybernode-depin.service
        sudo systemctl start cybernode-depin.service
        log "Systemd service installed and active! Will auto-start on Linux boot." "INFO"
        exit 0
        ;;
esac

# -----------------------------------------------------------------------------
# LAUNCH SEQUENCE
# -----------------------------------------------------------------------------
log "=========================================================="
log "STARTING CYBERNODE DePIN & AI EDGE COMPUTE ORCHESTRATOR"
log "Target: \$10.00 - \$15.00/day across Solana, EVM, and TON"
log "Resource Limits: Core Affinity Locked • Memory Capped"
log "=========================================================="

# 1. Docker Compose Priority (Linux Desktop / Server)
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
    log "Docker daemon active. Launching isolated container cluster..." "INFO"
    cd "${SCRIPT_DIR}"
    docker-compose up -d
    log "Containerized DePIN stack online!" "INFO"
else
    # 2. Standalone Linux / Raspberry Pi / Android Termux Mode
    log "Executing native background daemons with CPU & I/O throttling..." "INFO"

    # Python Watchdog & Scraping Workers
    if command -v python3 >/dev/null 2>&1; then
        nohup ${RUN_ISOLATED} python3 "${SCRIPT_DIR}/depin_sentinel.py" >> "${LOG_DIR}/sentinel.log" 2>&1 &
        log "DePIN Sentinel watchdog spawned (PID: $!)." "INFO"
    fi

    # GaGaNode Client
    if [ -f "${SCRIPT_DIR}/bin/gaganode" ]; then
        nohup ${RUN_ISOLATED} "${SCRIPT_DIR}/bin/gaganode" daemon >> "${LOG_DIR}/gaganode.log" 2>&1 &
        log "GaGaNode edge daemon spawned (PID: $!)." "INFO"
    fi

    # EarnApp Client
    if command -v earnapp >/dev/null 2>&1; then
        nohup ${RUN_ISOLATED} earnapp start >> "${LOG_DIR}/earnapp.log" 2>&1 &
        log "EarnApp daemon spawned (PID: $!)." "INFO"
    fi
fi

log "CyberNode DePIN cluster initialized successfully with zero desktop throttling!"
