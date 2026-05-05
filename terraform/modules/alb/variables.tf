variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnet IDs for the ALB"
  type        = list(string)
}

variable "app_server_instance_id" {
  description = "Instance ID of the app server to register in the target group"
  type        = string
}

variable "app_sg_id" {
  description = "App server security group ID - ALB SG will be allowed into it"
  type        = string
}
