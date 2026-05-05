output "alb_dns_name" {
  description = "Public DNS name of the ALB - open this in your browser"
  value       = aws_lb.main.dns_name
}

output "alb_sg_id" {
  description = "Security group ID of the ALB"
  value       = aws_security_group.alb.id
}
