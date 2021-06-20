variable "security_group_ids" { type=list(string) }
variable "subnet_ids" { type=list(string) }
variable "associate_public_ip" { type=bool }
variable "instance_type" { type=string, default="t2.micro" }
variable "zones" { type=list(string), default=["us-west-2"] }
variable "cluster" { type=string }
variable "group_name" { type=string }
variable "load_balancer_arns" {type=list(string), description="arns to classic load balancers"}
variable "iam_instance_profile" { type=string }