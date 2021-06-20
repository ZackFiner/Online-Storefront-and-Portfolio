provider "aws" {
    region = "us-west-2"
}

data "aws_caller_identity" "current" {

}

/*
    TODO: To do this correctly, we need to register a domain name and provide an SSL/TLS certicate.
            We will be using let's encrypt for the SSL certificates
    
    3 Elatic Load Balancers (Application) - one per each service

    1 API Gateway to route traffic to the load balancers for each microservice

    Keep in mind that this only covers the backend API.

    After doing an API gateway manually in terraform using the approrpiate elements, it would probably
    be best to use OpenAPI or some other standard to specifiy the API.

*/

module "vpc" { // setup the vpc for the ecs cluster
    source = "./modules/ecs_vpc"
}

module "iam_policies" { // do all necessary iam work for the cluster
    source = "./modules/ecs_iam"
}

resource "aws_ecs_cluster" "ecs_cluster" { // create the cluster
    name = "tf-storefront-ecs"
}

module "container_instances" { // create the container instances for the cluster
    source = "./modules/container_instance"

    security_group_ids      = module.vpc.security_groups
    subnet_ids              = module.vpc.subnets
    associate_public_ip     = true
    instance_type           = "t2.micro"
    cluster                 = aws_ecs_cluster.ecs_cluster.name
    group_name              = "group1"

    iam_instance_profile    = module.iam_policies.iam_instance_profile

}

// create load balancers for each service below
module "store_lb" {
    subnets = module.vpc.subnets
    internal = false
    security_groups = module.vpc.security_groups
    name = "store_load_balancer"
}

// maybe use this: https://registry.terraform.io/modules/cn-terraform/ecs-alb/aws/latest?tab=dependencies
// instead

module "blog_lb" {
    subnets = module.vpc.subnets
    internal = false
    security_groups = module.vpc.security_groups
    name = "blog_load_balancer"
}

module "user_lb" {
    subnets = module.vpc.subnets
    internal = false
    security_groups = module.vpc.security_groups
    name = "user_load_balancer"
}

module "blog_def" {
    source = "../task definitions/blog"
    taskExecutionRole = var.taskExecutionRole
    dockerHubSecretARN = var.dockerHubSecretARN
}


resource "aws_ecs_service" "blog" {
    name = "nodejs-blog-api-service"
    cluster = aws_ecs_cluster.ecs_cluster.id

    task_definition  = module.blog_def.arn
    desired_count = 1

    load_balancer {
        target_group_arn = module.blog_lb.target_group_arn
        container_port = module.blog_def.port
        container_name = module.blog_def.name
    }
}
// ecs task definitions for each microservice below



