resource "aws_vpc" "ecs_vpc" {
    cidr_block = "10.0.0.0/16"

}

resource "aws_internet_gateway" "internet_gateway" { // create an internet gateway for the vpc
    vpc_id = aws_vpc.ecs_vpc.id
}

resource "aws_subnet" "public_subnet1" { // setup a public subnet for our vpc
    vpc_id      = aws_vpc.ecs_vpc.id
    cidr_block  = "10.0.0.0/24"
    availability_zone = "us-west-2a"
}

resource "aws_subnet" "public_subnet2" { // setup a public subnet for our vpc
    vpc_id      = aws_vpc.ecs_vpc.id
    cidr_block  = "10.0.1.0/24"
    availability_zone = "us-west-2b"
}

resource "aws_route_table" "public" {
    vpc_id          = aws_vpc.ecs_vpc.id
    route {
        cidr_block  = "0.0.0.0/0" // route all traffic
        gateway_id  = aws_internet_gateway.internet_gateway.id // to the internet gateway
    }
}

resource "aws_route_table_association" "route_table_association1" {
    subnet_id       = aws_subnet.public_subnet1.id // associate our public subnet
    route_table_id  = aws_route_table.public.id // with the route table we created above
}

resource "aws_route_table_association" "route_table_association2" {
    subnet_id       = aws_subnet.public_subnet2.id // associate our public subnet
    route_table_id  = aws_route_table.public.id // with the route table we created above
}


resource "aws_security_group" "ecs_security_group" {
    vpc_id          = aws_vpc.ecs_vpc.id

    ingress { // SSH
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    
    ingress { // SSL
        from_port   = 443
        to_port     = 443
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port   = 0
        to_port     = 65535
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

output "security_groups" {
    value = [aws_security_group.ecs_security_group.id]
}

output "subnets" {
    value = [aws_subnet.public_subnet1.id, aws_subnet.public_subnet2.id]
}

output "id" {
    value = aws_vpc.ecs_vpc.id
}