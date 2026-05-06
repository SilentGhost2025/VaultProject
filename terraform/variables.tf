################################################################################
# Witty Tale Vault - Root Variables
################################################################################

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used as prefix for all resources"
  type        = string
  default     = "witty-tale-vault"
}

variable "environment" {
  description = "Deployment environment (prod, staging, dev)"
  type        = string
  default     = "prod"
}

# ── Network ───────────────────────────────────────────────────────────────────

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (one per AZ)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets (one per AZ)"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

# ── Security ──────────────────────────────────────────────────────────────────

variable "your_ip_cidr" {
  description = "Your personal IP address in CIDR notation for SSH access to bastion (e.g. 1.2.3.4/32)"
  type        = string
  # Override this in terraform.tfvars — never leave 0.0.0.0/0 in production
}

variable "key_name" {
  description = "Name of the EC2 key pair for SSH access"
  type        = string
}

# ── EC2 Instance Types ────────────────────────────────────────────────────────

variable "ami_id" {
  description = "Ubuntu 22.04 LTS AMI ID (region-specific)"
  type        = string
  # Ubuntu 22.04 LTS in us-east-1 — verify latest at https://cloud-images.ubuntu.com/locator/ec2/
  default     = "ami-0c7217cdde317cfec"
}

variable "bastion_instance_type" {
  description = "Instance type for bastion host"
  type        = string
  default     = "t3.micro"
}

variable "jenkins_instance_type" {
  description = "Instance type for Jenkins (needs decent CPU/RAM for Maven builds)"
  type        = string
  default     = "t3.micro"
}

/**
variable "sonarqube_instance_type" {
  description = "Instance type for SonarQube (needs at least 4GB RAM)"
  type        = string
  default     = "t3.micro"
}
*/

variable "app_instance_type" {
  description = "Instance type for application server"
  type        = string
  default     = "t3.micro"
}
