resource "aws_alb" "load_balancer" {
    name                    = var.name
    internal                = var.internal
    load_balancer_type      = "application"

    security_groups         = var.security_groups
    subnets                 = var.subnets   
}

resource "aws_alb_target_group" "target_group" {
    name            = "${var.name}-tg"
    port            = 80
    protocol        = "HTTP"
    target_type     = "ip"
    vpc_id          = var.vpc_id
}

resource "aws_alb_listener" "listener" {
    load_balancer_arn = aws_alb.load_balancer.arn
    port = 80 // when you get an SSL certificate, switch this to 443, and the protocol to https
    protocol = "HTTP"

    default_action {
        type = "forward"
        target_group_arn = aws_alb_target_group.target_group.arn
    }

}

output "arn" {
    value = aws_lb.load_balancer.arn
}

output "target_group_arn" {
    value = aws_alb_target_group.target_group.arn
}
