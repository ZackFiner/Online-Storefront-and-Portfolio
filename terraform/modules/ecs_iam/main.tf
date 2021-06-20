// ---------------------- IAM profile creation ---------------------- 

data "aws_iam_policy_document" "ecs_instance" { // ecs instance role document
    statement {
        actions     = ["sts:AssumeRole"]
        
        principals {
            type        = "Service"
            identifiers = ["ec2.amazonaws.com"]
        }
    }
}

resource "aws_iam_role" "ecs_instance_role" { // role for ecs instances
    name                = "ecsInstanceRole"
    assume_role_policy  = data.aws_iam_policy_document.ecs_instance.json
}

resource "aws_iam_role_policy_attachment" "ecs_instance" { // policy for ecs instances
    role        = aws_iam_role.ecs_instance_role.name
    policy_arn  = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role" // role needed for ecs instances to be managed
}

resource "aws_iam_instance_profile" "ecs_instance" {
    name = "ecsInstanceProfile"
    role = aws_iam_role.ecs_instance_role.name
}

output "iam_instance_profile" {
    value = aws_iam_instance_profile.ecs_instance.name
}