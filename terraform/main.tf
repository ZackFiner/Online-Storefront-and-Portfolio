provider "aws" {
    region = "us-west-2"
}

data "aws_caller_identity" "current" {

}

/*
    TODO: To do this correctly, we need to register a domain name and provide an SSL/TLS certicate.
            We will be using let's encrypt for the SSL certificates
    
    TODO: setup the following services - 
    1 EC2 Container Instance - this is what the containers will actually run on

    1 ECS Cluster with 3 Services, 1 per microservice, use the docker images built for each microservice
    
    3 Elatic Load Balancers (Application) - one per each service

    1 API Gateway to route traffic to the load balancers for each microservice

    Keep in mind that this only covers the backend API.

    After doing an API gateway manually in terraform using the approrpiate elements, it would probably
    be best to use OpenAPI or some other standard to specifiy the API.

*/

