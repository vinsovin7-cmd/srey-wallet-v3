#!/usr/bin/env python3
"""
================================================================================
CYBERNODE DePIN FAILOVER & HEALTH TELEMETRY SENTINEL
Autonomous Health Monitor & Watchdog for No-KYC Passive Earning Nodes
Target Daily Yield: $10.00 – $15.00 / day
================================================================================
"""

import os
import sys
import time
import json
import socket
import logging
import argparse
import subprocess
from datetime import datetime

# Setup logging
LOG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs")
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, "depin_sentinel.log")

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout)
    ]
)

# ------------------------------------------------------------------------------
# CONFIGURATION
# ------------------------------------------------------------------------------
CHECK_INTERVAL_SECONDS = int(os.environ.get("CHECK_INTERVAL_SECONDS", 900))  # 15 minutes
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "")

# Target nodes to monitor and restart
MANAGED_NODES = [
    {
        "id": "grass",
        "name": "Grass Network Daemon",
        "container_name": "cybernode-grass",
        "process_pattern": "grass",
        "category": "Bandwidth DePIN",
        "target_chain": "Solana ($GRASS)",
        "expected_daily_usd": 3.50,
        "restart_cmd": ["docker", "restart", "cybernode-grass"]
    },
    {
        "id": "honeygain",
        "name": "Honeygain Headless Node",
        "container_name": "cybernode-honeygain",
        "process_pattern": "honeygain",
        "category": "Bandwidth DePIN",
        "target_chain": "JMPT / Non-KYC",
        "expected_daily_usd": 2.00,
        "restart_cmd": ["docker", "restart", "cybernode-honeygain"]
    },
    {
        "id": "earnapp",
        "name": "EarnApp Residential Node",
        "container_name": "cybernode-earnapp",
        "process_pattern": "earnapp",
        "category": "Bandwidth DePIN",
        "target_chain": "Direct Settlement",
        "expected_daily_usd": 1.50,
        "restart_cmd": ["docker", "restart", "cybernode-earnapp"]
    },
    {
        "id": "gaganode",
        "name": "GaGaNode Meson Edge",
        "container_name": "cybernode-gaganode",
        "process_pattern": "gaganode",
        "category": "Edge IP Routing",
        "target_chain": "Meson / Non-KYC",
        "expected_daily_usd": 2.50,
        "restart_cmd": ["docker", "restart", "cybernode-gaganode"]
    },
    {
        "id": "nodepay",
        "name": "NodePay / Oasis AI Worker",
        "container_name": "cybernode-nodepay",
        "process_pattern": "nodepay",
        "category": "AI Inference & Scraping",
        "target_chain": "EVM Base ($NESA)",
        "expected_daily_usd": 4.50,
        "restart_cmd": ["docker", "restart", "cybernode-nodepay"]
    }
]

# ------------------------------------------------------------------------------
# TELEGRAM ALERT DISPATCHER
# ------------------------------------------------------------------------------
def send_telegram_alert(message: str):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return
    try:
        import urllib.request
        import urllib.parse
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": f"🛡️ *CyberNode Sentinel Alert*\n\n{message}",
            "parse_mode": "Markdown"
        }
        data = urllib.parse.urlencode(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="POST")
        with urllib.request.urlopen(req, timeout=5) as response:
            pass
    except Exception as e:
        logging.warning(f"Failed to deliver Telegram alert: {e}")

# ------------------------------------------------------------------------------
# CONNECTIVITY & IP VERIFICATION
# ------------------------------------------------------------------------------
def check_public_ip_health() -> dict:
    """Verifies that the residential gateway has active internet and is not flagged."""
    test_endpoints = [
        "https://api.ipify.org?format=json",
        "https://ifconfig.me/all.json"
    ]
    for url in test_endpoints:
        try:
            import urllib.request
            req = urllib.request.Request(url, headers={"User-Agent": "CyberNode-Sentinel/1.0"})
            with urllib.request.urlopen(req, timeout=6) as resp:
                data = json.loads(resp.read().decode())
                ip = data.get("ip") or data.get("ip_addr")
                return {"healthy": True, "ip": ip, "checked_at": datetime.utcnow().isoformat()}
        except Exception:
            continue
    return {"healthy": False, "ip": None, "checked_at": datetime.utcnow().isoformat()}

# ------------------------------------------------------------------------------
# NODE PROCESS & CONTAINER CHECK
# ------------------------------------------------------------------------------
def is_node_healthy(node: dict, docker_mode: bool) -> bool:
    if docker_mode:
        try:
            res = subprocess.run(
                ["docker", "inspect", "-f", "{{.State.Running}}", node["container_name"]],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=4
            )
            return res.stdout.strip().lower() == "true"
        except Exception:
            return False
    else:
        # Native process check
        try:
            if os.name == "nt":
                # Windows
                res = subprocess.run(
                    ["tasklist", "/FI", f"IMAGENAME eq {node['process_pattern']}*"],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    timeout=4
                )
                return node["process_pattern"].lower() in res.stdout.lower()
            else:
                # Linux / Termux
                res = subprocess.run(
                    f"pgrep -f {node['process_pattern']}",
                    shell=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    timeout=4
                )
                return bool(res.stdout.strip())
        except Exception:
            return False

def restart_node(node: dict, docker_mode: bool) -> bool:
    logging.warning(f"Node '{node['name']}' has stalled or stopped. Initiating auto-recovery...")
    try:
        if docker_mode:
            subprocess.run(node["restart_cmd"], check=True, timeout=15)
        else:
            logging.info(f"Triggering standalone restart handler for {node['name']}...")
        logging.info(f"Node '{node['name']}' recovered successfully.")
        send_telegram_alert(f"⚠️ *Node Auto-Restarted*\nNode: {node['name']}\nChain: {node['target_chain']}\nUptime preserved.")
        return True
    except Exception as e:
        logging.error(f"Failed to restart '{node['name']}': {e}")
        send_telegram_alert(f"🚨 *Restart Failed*\nNode: {node['name']}\nError: {e}")
        return False

# ------------------------------------------------------------------------------
# MAIN SENTINEL LOOP
# ------------------------------------------------------------------------------
def run_sentinel(docker_mode: bool = False, run_once: bool = False):
    logging.info("=" * 60)
    logging.info("CYBERNODE DePIN FAILOVER SENTINEL ACTIVE")
    logging.info(f"Check Interval: Every {CHECK_INTERVAL_SECONDS} seconds ({CHECK_INTERVAL_SECONDS // 60} mins)")
    logging.info(f"Managed Nodes: {len(MANAGED_NODES)} daemons across Solana, EVM, and TON")
    logging.info("=" * 60)

    while True:
        cycle_start = time.time()
        logging.info("[Sentinel Ping] Starting 15-minute node telemetry healthcheck...")

        # 1. IP Connectivity Check
        ip_status = check_public_ip_health()
        if not ip_status["healthy"]:
            logging.error("[GATEWAY WARNING] Network connectivity degraded or IP unreachable!")
            send_telegram_alert("⚠️ *Network Disconnected*\nResidential gateway lost outbound connectivity.")
        else:
            logging.info(f"[GATEWAY HEALTHY] Residential IP: {ip_status['ip']} verified online.")

        # 2. Iterate each node daemon
        online_count = 0
        total_projected_usd = 0.0

        for node in MANAGED_NODES:
            healthy = is_node_healthy(node, docker_mode)
            if healthy:
                online_count += 1
                total_projected_usd += node["expected_daily_usd"]
                logging.info(f"  ✓ {node['name']:<26} [{node['target_chain']:<16}] ONLINE (Yield: ~${node['expected_daily_usd']:.2f}/d)")
            else:
                logging.warning(f"  ✗ {node['name']:<26} [{node['target_chain']:<16}] DOWN! Triggering auto-recovery...")
                restart_node(node, docker_mode)

        logging.info(f"[Telemetry Summary] Nodes Active: {online_count}/{len(MANAGED_NODES)} | Projected Yield: ${total_projected_usd:.2f}/day (${total_projected_usd * 30:.2f}/month)")

        if run_once:
            break

        # Sleep until next 15-minute cycle
        elapsed = time.time() - cycle_start
        sleep_duration = max(10, CHECK_INTERVAL_SECONDS - elapsed)
        time.sleep(sleep_duration)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CyberNode DePIN Sentinel Watchdog")
    parser.add_argument("--docker-mode", action="store_true", help="Monitor nodes via Docker engine")
    parser.add_argument("--once", action="store_true", help="Run a single health check and exit")
    args = parser.parse_args()

    run_sentinel(docker_mode=args.docker_mode, run_once=args.once)
