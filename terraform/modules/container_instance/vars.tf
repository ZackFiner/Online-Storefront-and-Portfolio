variable "vpc_id" { type=string }
variable "security_group_ids" { type=list(string) }
variable "subnet_id" { type=string }
variable "associate_public_ip" { type=bool }