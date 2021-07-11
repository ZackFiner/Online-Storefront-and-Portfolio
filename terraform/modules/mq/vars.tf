variable "broker_name" {
    type = string
}
variable "security_groups" {
    type = list(string)
}
variable "mq_username" {
    type = string
}
variable "mq_password" {
    type = string
}