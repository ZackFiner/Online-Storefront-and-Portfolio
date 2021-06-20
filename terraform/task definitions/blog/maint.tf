resource "aws_ecs_task_definition" "blog" {
    family = "node-js-webapp-blog"
    container_definitions = jsonencode([{
        portMappings =  [
          {
            hostPort = 0
            protocol =  "tcp"
            containerPort = 3002
          }
        ]
        
        repositoryCredentials =  {
          credentialsParameter =  var.dockerHubSecretARN
        }
        image =  "zackfiner2000/zackf:posts_webapp"
        name = "nodejs-post-api"
    }])

    execution_role_arn = var.taskExecutionRole
    cpu = 256
    memory = 512
    networkMode = "bridge"

    requires_compatibilities = ["EC2"]
}

output "arn" {
  value = aws_ecs_task_definition.blog.arn
}

output "port" {
  value = 3002
}

output "name" {
  value = "nodejs-post-api"
}