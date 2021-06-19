data "aws_ami" "ecs_linux_ami" {
    most_recent = true // get the most recent ami if multiple are returned
    owners = ["amazon"]

    filter { // select amis with names starting with amzn2-ami-ecs-*
        name = "name"
        values =  ["amzn2-ami-ecs-*"]
    }

    filter { // select the hardware virtualization images
        name = "virtualization-type"
        values = ["hvm"]
    }

    filter { // select images with the EBS root device type
        name= "root-device-type"
        values = ["ebs"]
    }
}

resource "aws_instance" "container_instance" {
    ami = data.aws_ami.ecs_linux_ami.id
    instance_type = "t2.micro"

    associate_public_ip_address = var.associate_public_ip
    subnet_id = var.subnet_id
    vpc_security_group_ids = var.security_group_ids

    // TODO:
}
