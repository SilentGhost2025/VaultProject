#!/bin/bash
# Bastion Host Bootstrap Script
# Minimal setup — bastion is just a jump host, keep it lean

set -euo pipefail
exec > >(tee /var/log/userdata.log | logger -t userdata -s 2>/dev/console) 2>&1

echo "=== Starting Bastion Host Setup ==="

# Update system
apt-get update -y
apt-get upgrade -y

# Install only what's needed for a bastion
apt-get install -y \
  awscli \
  curl \
  wget \
  unzip \
  htop \
  net-tools \
  tcpdump \
  nmap \
  fail2ban

# ── Harden SSH ────────────────────────────────────────────────────────────────
# Disable root login, disable password auth, only allow key-based auth
cat >> /etc/ssh/sshd_config <<'EOF'

# Hardening
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
LoginGraceTime 20
EOF

systemctl restart sshd

# ── Enable fail2ban to block brute-force attempts ─────────────────────────────
systemctl enable fail2ban
systemctl start fail2ban

# ── CloudWatch Agent ──────────────────────────────────────────────────────────
wget -q https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
dpkg -i amazon-cloudwatch-agent.deb

cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json <<'CWEOF'
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/auth.log",
            "log_group_name": "/witty-tale-vault/bastion/auth",
            "log_stream_name": "{instance_id}",
            "retention_in_days": 30
          },
          {
            "file_path": "/var/log/userdata.log",
            "log_group_name": "/witty-tale-vault/bastion/userdata",
            "log_stream_name": "{instance_id}",
            "retention_in_days": 7
          }
        ]
      }
    }
  },
  "metrics": {
    "metrics_collected": {
      "cpu": { "measurement": ["cpu_usage_idle", "cpu_usage_user"], "metrics_collection_interval": 60 },
      "mem": { "measurement": ["mem_used_percent"], "metrics_collection_interval": 60 },
      "disk": { "measurement": ["disk_used_percent"], "resources": ["/"], "metrics_collection_interval": 60 }
    },
    "append_dimensions": { "InstanceId": "$${aws:InstanceId}" }
  }
}
CWEOF

/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s

echo "=== Bastion Host Setup Complete ==="
