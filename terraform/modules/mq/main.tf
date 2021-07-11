resource "aws_mq_configuration" "broker_config" {
    description     = "Terraform Generated Message Queue Configuration"
    name            = "${var.broker_name}Config"
    engine_type     = "ActiveMQ"
    engine_version  = "5.15.0"

    data            = <<DATA
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<broker xmlns="http://activemq.apache.org/schema/core">
</broker>
DATA
}

resource "aws_mq_broker" "broker" {
    broker_name         = var.broker_name
    
    engine_type         = "ActiveMQ"
    engine_version      = "5.15.0"
    storage_type        = "ebs"
    host_instance_type  = "mq.t2.micro"
    security_groups = var.security_groups

    configuration {
        id          = aws_mq_configuration.broker_config.id
        revision    = aws_mq_configuration.broker_config.latest_revision
    }

    user {
        username    = var.mq_username
        password    = var.mq_password
    }

}

output "arn" {
    value = aws_mq_broker.broker.arn
}

output "id" {
    value = aws_mq_broker.broker.id
}