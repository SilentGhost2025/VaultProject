#!/bin/bash
# Jenkins Server Bootstrap Script
# Installs: Java 21, Maven, Jenkins, Docker
# Jenkins will handle: Build → SonarQube → Docker Build → Push → Deploy

set -euo pipefail
exec > >(tee /var/log/userdata.log | logger -t userdata -s 2>/dev/console) 2>&1

echo "=== Starting Jenkins Server Setup ==="

# Update system
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
  git \
  awscli

# ── Java 21 ───────────────────────────────────────────────────────────────────
apt-get install -y openjdk-21-jdk
java -version
echo "JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64" >> /etc/environment
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64

# ── Maven ─────────────────────────────────────────────────────────────────────
MAVEN_VERSION="3.9.6"
wget -q "https://downloads.apache.org/maven/maven-3/$${MAVEN_VERSION}/binaries/apache-maven-$${MAVEN_VERSION}-bin.tar.gz" \
  -O /tmp/maven.tar.gz
tar -xzf /tmp/maven.tar.gz -C /opt/
ln -sf /opt/apache-maven-$${MAVEN_VERSION} /opt/maven
echo "export M2_HOME=/opt/maven" >> /etc/profile.d/maven.sh
echo "export PATH=\$M2_HOME/bin:\$PATH" >> /etc/profile.d/maven.sh
chmod +x /etc/profile.d/maven.sh
source /etc/profile.d/maven.sh
export PATH=/opt/maven/bin:$PATH
mvn -version

# ── Docker ────────────────────────────────────────────────────────────────────
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

systemctl enable docker
systemctl start docker

# ── Jenkins ───────────────────────────────────────────────────────────────────
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | \
  tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/" \
  > /etc/apt/sources.list.d/jenkins.list

apt-get update -y
apt-get install -y jenkins

# Give Jenkins access to Docker socket
usermod -aG docker jenkins

systemctl enable jenkins
systemctl start jenkins

# ── Wait for Jenkins to start, then print initial admin password ───────────────
echo "Waiting for Jenkins to start..."
sleep 30
echo "=== Jenkins Initial Admin Password ==="
cat /var/lib/jenkins/secrets/initialAdminPassword 2>/dev/null || echo "Password file not ready yet — check /var/lib/jenkins/secrets/initialAdminPassword"

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
            "file_path": "/var/log/jenkins/jenkins.log",
            "log_group_name": "/witty-tale-vault/jenkins/app",
            "log_stream_name": "{instance_id}",
            "retention_in_days": 30
          },
          {
            "file_path": "/var/log/userdata.log",
            "log_group_name": "/witty-tale-vault/jenkins/userdata",
            "log_stream_name": "{instance_id}",
            "retention_in_days": 7
          },
          {
            "file_path": "/var/log/auth.log",
            "log_group_name": "/witty-tale-vault/jenkins/auth",
            "log_stream_name": "{instance_id}",
            "retention_in_days": 30
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

echo "=== Jenkins Server Setup Complete ==="
echo "Access Jenkins via SSH tunnel: ssh -L 8080:<JENKINS_PRIVATE_IP>:8080 ubuntu@<BASTION_IP>"
echo "Then open: http://localhost:8080"
