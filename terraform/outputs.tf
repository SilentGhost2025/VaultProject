################################################################################
# Witty Tale Vault - Root Outputs
################################################################################

# ── VPC ───────────────────────────────────────────────────────────────────────

output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.vpc.private_subnet_ids
}

# ── Bastion ───────────────────────────────────────────────────────────────────

output "bastion_public_ip" {
  description = "Public IP of the bastion host — use this to SSH in"
  value       = module.bastion.public_ip
}

output "bastion_instance_id" {
  description = "Instance ID of the bastion host"
  value       = module.bastion.instance_id
}

# ── Jenkins ───────────────────────────────────────────────────────────────────

output "jenkins_private_ip" {
  description = "Private IP of the Jenkins server"
  value       = module.jenkins.private_ip
}

output "jenkins_instance_id" {
  description = "Instance ID of Jenkins server"
  value       = module.jenkins.instance_id
}

output "jenkins_access_instructions" {
  description = "How to access Jenkins via SSH tunnel through bastion"
  value       = "ssh -L 8080:${module.jenkins.private_ip}:8080 -i <your-key>.pem ubuntu@${module.bastion.public_ip} then open http://localhost:8080"
}

/**
# ── SonarQube ─────────────────────────────────────────────────────────────────

output "sonarqube_private_ip" {
  description = "Private IP of the SonarQube server"
  value       = module.sonarqube.private_ip
}

output "sonarqube_access_instructions" {
  description = "How to access SonarQube via SSH tunnel through bastion"
  value       = "ssh -L 9000:${module.sonarqube.private_ip}:9000 -i <your-key>.pem ubuntu@${module.bastion.public_ip} then open http://localhost:9000"
}
*/

# ── App Server ────────────────────────────────────────────────────────────────

output "app_server_private_ip" {
  description = "Private IP of the application server"
  value       = module.app_server.private_ip
}

output "app_server_instance_id" {
  description = "Instance ID of the app server"
  value       = module.app_server.instance_id
}

output "app_access_instructions" {
  description = "How to reach the app API gateway via SSH tunnel"
  value       = "ssh -L 8080:${module.app_server.private_ip}:8080 -i <your-key>.pem ubuntu@${module.bastion.public_ip} then open http://localhost:8080"
}
