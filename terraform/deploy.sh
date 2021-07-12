#!/bin/bash

docker build "../micro/orders/" -t zackfiner2000/zackf:store_orders_webapp
docker build "../micro/payments/" -t zackfiner2000/zackf:store_payments_webapp
docker build "../micro/posts/" -t zackfiner2000/zackf:store_posts_webapp
docker build "../micro/store/" -t zackfiner2000/zackf:store_store_webapp
docker build "../micro/user/" -t zackfiner2000/zackf:store_user_webapp

docker push zackfiner2000/zackf:store_orders_webapp
docker push zackfiner2000/zackf:store_payments_webapp
docker push zackfiner2000/zackf:store_posts_webapp
docker push zackfiner2000/zackf:store_store_webapp
docker push zackfiner2000/zackf:store_user_webapp

terraform apply