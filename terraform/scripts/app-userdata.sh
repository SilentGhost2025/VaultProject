#!/bin/bash
# Application Server Bootstrap Script
# Installs: Docker, Docker Compose
# Jenkins will SSH into this server and run docker compose up to deploy

set -euo pipefail
exec > >(tee /var/log/userdata.log | logger -t userdata -s 2>/dev/console) 2>&1

echo "=== Starting Application Server Setup ==="

apt-get update -y
apt-get upgrade -y

apt-get install -y \
  curl \
  wget \
  unzip \
  gnupg \
  software-properties-common \
  apt-transport-https \
  ca-certificates \
  awscli \
  git

# ── Docker ────────────────────────────────────────────────────────────────────
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

systemctl enable docker
systemctl start docker

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# ── Create app deployment directory ───────────────────────────────────────────
mkdir -p /opt/witty-tale-vault
chown ubuntu:ubuntu /opt/witty-tale-vault

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
            "file_path": "/var/log/userdata.log",
            "log_group_name": "/witty-tale-vault/app/userdata",
            "log_stream_name": "{instance_id}",
            "retention_in_days": 7
          },
          {
            "file_path": "/var/log/auth.log",
            "log_group_name": "/witty-tale-vault/app/auth",
            "log_stream_name": "{instance_id}",
            "retention_in_days": 30
          }
        ]
      }
    },
    "log_stream_name": "{instance_id}"
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

echo "=== Application Server Setup Complete ==="
echo "Docker is installed and ready. Jenkins will SSH in to deploy containers."
