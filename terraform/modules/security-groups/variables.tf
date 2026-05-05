variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  description = "VPC ID to create security groups in"
  type        = string
}

variable "your_ip_cidr" {
  description = "Your IP address in CIDR notation for bastion SSH access"
  type        = string
}
