output "bastion_sg_id" {
  description = "Security group ID for bastion host"
  value       = aws_security_group.bastion.id
}

output "jenkins_sg_id" {
  description = "Security group ID for Jenkins server"
  value       = aws_security_group.jenkins.id
}

output "sonarqube_sg_id" {
  description = "Security group ID for SonarQube server"
  value       = aws_security_group.sonarqube.id
}

output "app_sg_id" {
  description = "Security group ID for application server"
  value       = aws_security_group.app.id
}
