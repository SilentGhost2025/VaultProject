################################################################################
# Witty Tale Vault - Root Terraform Configuration
# Wires together all modules: VPC, Security Groups, IAM, EC2 instances
################################################################################

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state stored in S3 — create this bucket manually once before first apply
  backend "s3" {
    bucket         = "witty-tale-vault-tfstate"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    use_lockfile   = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "witty-tale-vault"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

################################################################################
# VPC Module
################################################################################
module "vpc" {
  source = "./modules/vpc"

  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones   = var.availability_zones
}

################################################################################
# Security Groups Module
################################################################################
module "security_groups" {
  source = "./modules/security-groups"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
  your_ip_cidr = var.your_ip_cidr
}

################################################################################
# IAM Module
################################################################################
module "iam" {
  source = "./modules/iam"

  project_name = var.project_name
  environment  = var.environment
}

################################################################################
# EC2 Module — Bastion Host (public subnet)
################################################################################
module "bastion" {
  source = "./modules/ec2"

  project_name          = var.project_name
  environment           = var.environment
  instance_name         = "bastion"
  instance_type         = var.bastion_instance_type
  ami_id                = var.ami_id
  subnet_id             = module.vpc.public_subnet_ids[0]
  security_group_ids    = [module.security_groups.bastion_sg_id]
  iam_instance_profile  = module.iam.ec2_instance_profile_name
  key_name              = var.key_name
  associate_public_ip   = true
  user_data             = templatefile("${path.module}/scripts/bastion-userdata.sh", {
    project_name = var.project_name
  })
  root_volume_size      = 20
}

################################################################################
# EC2 Module — Jenkins Server (private subnet)
################################################################################
module "jenkins" {
  source = "./modules/ec2"

  project_name          = var.project_name
  environment           = var.environment
  instance_name         = "jenkins"
  instance_type         = var.jenkins_instance_type
  ami_id                = var.ami_id
  subnet_id             = module.vpc.private_subnet_ids[0]
  security_group_ids    = [module.security_groups.jenkins_sg_id]
  iam_instance_profile  = module.iam.ec2_instance_profile_name
  key_name              = var.key_name
  associate_public_ip   = false
  user_data             = templatefile("${path.module}/scripts/jenkins-userdata.sh", {
    project_name = var.project_name
  })
  root_volume_size      = 30
}

/**
  ################################################################################
  # EC2 Module — SonarQube Server (private subnet)
  ################################################################################
  module "sonarqube" {
    source = "./modules/ec2"

    project_name          = var.project_name
    environment           = var.environment
    instance_name         = "sonarqube"
    instance_type         = var.sonarqube_instance_type
    ami_id                = var.ami_id
    subnet_id             = module.vpc.private_subnet_ids[0]
    security_group_ids    = [module.security_groups.sonarqube_sg_id]
    iam_instance_profile  = module.iam.ec2_instance_profile_name
    key_name              = var.key_name
    associate_public_ip   = false
    user_data             = templatefile("${path.module}/scripts/sonarqube-userdata.sh", {
      project_name = var.project_name
    })
    root_volume_size      = 30
  }
*/

################################################################################
# EC2 Module — Application Server (private subnet)
################################################################################
module "app_server" {
  source = "./modules/ec2"

  project_name          = var.project_name
  environment           = var.environment
  instance_name         = "app-server"
  instance_type         = var.app_instance_type
  ami_id                = var.ami_id
  subnet_id             = module.vpc.private_subnet_ids[0]
  security_group_ids    = [module.security_groups.app_sg_id]
  iam_instance_profile  = module.iam.ec2_instance_profile_name
  key_name              = var.key_name
  associate_public_ip   = false
  user_data             = templatefile("${path.module}/scripts/app-userdata.sh", {
    project_name = var.project_name
  })
  root_volume_size      = 30
}
