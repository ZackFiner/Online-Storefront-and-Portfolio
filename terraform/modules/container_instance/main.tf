// ---------------------- Instance Creation ---------------------- 

data "aws_ami" "ecs_linux_ami" {
    most_recent = true // get the most recent ami if multiple are returned
    owners      = ["amazon"]

    filter { // select amis with names starting with amzn2-ami-ecs-*
        name    = "name"
        values  =  ["amzn2-ami-ecs-*"]
    }

    filter { // select the hardware virtualization images
        name    = "virtualization-type"
        values  = ["hvm"]
    }

    filter { // select images with the EBS root device type
        name    = "root-device-type"
        values  = ["ebs"]
    }
}

resource "aws_launch_configuration" "container_instance" {
    name_prefix                 = "ecs-cluster-instance-"
    image_id                    = data.aws_ami.ecs_linux_ami.id
    instance_type               = var.instance_type

    iam_instance_profile        = var.iam_instance_profile
    associate_public_ip_address = var.associate_public_ip
    security_groups             = var.security_group_ids
    user_data                   = "#!/bin/bash\necho ECS_CLUSTER=${var.cluster} >> /etc/ecs/ecs.config"
}

resource "aws_autoscaling_group" "container_instances" {
    name = "${var.cluster}_instances"

    // for now, only allow 1 instance at a time
    desired_capacity        = 1
    max_size                = 1
    min_size                = 1
    force_delete            = true

    launch_configuration    = aws_launch_configuration.container_instance.name
    vpc_zone_identifier     = var.subnet_ids

    load_balancers          = var.load_balancer_arns
}