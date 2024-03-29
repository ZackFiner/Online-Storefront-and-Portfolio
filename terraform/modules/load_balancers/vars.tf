variable "subnets" { 
    type =  list(string) 
}
variable "internal" {
    type = bool
}
variable "security_groups" {
    type = list(string)
}
variable "name" {
    type = string
}
variable "vpc_id" {
    type = string
}

variable "target_port" {
    type = number
    default = 443
}

variable "ssl_cert_arn" {
    type = string
}