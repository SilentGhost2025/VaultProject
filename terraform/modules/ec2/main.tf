################################################################################
# Module: EC2
# Reusable module for any EC2 instance in this project
################################################################################

resource "aws_instance" "this" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = var.security_group_ids
  key_name                    = var.key_name
  iam_instance_profile        = var.iam_instance_profile
  associate_public_ip_address = var.associate_public_ip

  user_data = var.user_data

  root_block_device {
    volume_type           = "gp3"
    volume_size           = var.root_volume_size
    delete_on_termination = true
    encrypted             = true  # Encrypt EBS volumes — best practice

    tags = {
      Name = "${var.project_name}-${var.environment}-${var.instance_name}-root-vol"
    }
  }

  # Prevent accidental termination in production
  disable_api_termination = var.environment == "prod" ? true : false

  metadata_options {
    # IMDSv2 only — security best practice to prevent SSRF attacks on instance metadata
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-${var.instance_name}"
    Role = var.instance_name
  }
}

# ── CloudWatch Alarms ─────────────────────────────────────────────────────────

resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "${var.project_name}-${var.environment}-${var.instance_name}-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "CPU utilization is too high on ${var.instance_name}"

  dimensions = {
    InstanceId = aws_instance.this.id
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-${var.instance_name}-cpu-alarm"
  }
}
