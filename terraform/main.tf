provider "aws" {
    region = "us-west-2"
}

data "aws_caller_identity" "current" {

}

module "vpc" { // setup the vpc for the ecs cluster
    source = "./modules/ecs_vpc"
}

/*
    TODO:
    We need to add a few more resources in order to eliminate the need for external connections from within the VPC:
    1. A S3 bucket for image storage and hosting (x)
    2. A VPC Endpoint gateway so resources in private subnets can access the S3 bucket for uploading (x)
    3. A mongodb database cluster (EC2) to eliminate the need for a mongodb atlas connections

    Also, we should setup an Amazon Message Queue using ActiveMQ to facilitate messaging between services (specifically the orders and payments service).
    This message queue should be setup within a private subnet of the VPC.
*/

module "message_broker" {
    source          = "./modules/mq"

    broker_name     = var.message_broker_name
    security_groups = module.vpc.security_groups
    mq_username     = var.mq_username
    mq_password     = var.mq_password
}

// TODO: this S3 needs to allow public get access to resources within it, but protected access to publish to it.
resource "aws_s3_bucket" "image_bucket" {
    bucket  = "tf-finer-studio-image-bucket"
    acl     = "private"
    // ...
}

resource "aws_vpc_endpoint" "image_bucket_endpoint" { // this endpoint should allow services in private subnets to access the S3 bucket in order to upload files
    vpc_id              = module.vpc.id
    service_name        = "com.amazonaws.us-west-2.s3"
    vpc_endpoint_type   = "Gateway"
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
/*
    Because we need network connectivity from the containers on the ec2 instance to access cloudinary and mongodb atlas, we couldn't use
    awsvpc as the network mode (since this wouldn't allow the containers to access the Internet). Right now, we have a less than ideal
    setup: our load balancer serves only to route traffic to a single container on a single EC2 Instance (defeating the point of network
    balancing). One of the following re-works are needed to improve this situation:

        1. Add a NAT Gateway to one of the private subnets to allow the containers to access the internet from within the VPC
            ! This is expensive; NAT Gateways are priced by hourly rates + data transfer fees. Yearly charges will be >$300 without any
              network activity!
        2. Abandon all external dependencies and move image hosting (currently provided by cloudinary) and the database layer (MongoDB Atlas)
           into AWS to avoid the need for any external network connections
            ! This is a major refactor, and would involve the creation of a new Image Hosting Microservice that uses S3 buckets
            ! Since the database layer will be self-managed, we lose the benefit of a completely managed (MongoDB Atlas) database
            ! Again, we would now need to manage both our image hosting and database layer ourselves
        3. Use Fargate task instances on a public subnet instead of instances running on EC2's (because unlike tasks on ecs ec2 instances
           tasks on fargate in a public subnet have internet access)
            ! Fargate has no free tier

*/
module "blog_def" {
    source = "./task-definitions/blog"
    taskExecutionRole = var.taskExecutionRole
    dockerHubSecretARN = var.dockerHubSecretARN
}

module "blog_lb" {
    source = "./modules/load_balancers"
    subnets = module.vpc.subnets
    internal = false
    security_groups = module.vpc.security_groups
    name = "blog-load-balancer"
    vpc_id = module.vpc.id
    ssl_cert_arn = var.SSLCertificateARN
    target_port = module.blog_def.port
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



