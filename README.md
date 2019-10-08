# kubernetes

Kubernetes (commonly stylized as k8s) is an open-source container-orchestration system for automating application deployment, scaling, and management

## Requirements

Linux. Version used: Ubuntu Disco 19.04
 
## Docker installation

Docker is often used with Kubernetes. Hence, Kubernetes manages a cluster of Docker containers. 

https://docs.docker.com/install/linux/docker-ce/ubuntu/

## Install Lightweight Kubernetes: k3s


There are many different Kubernetes solutions: learning or production environments, oncloud or offcloud... This tutorial use k3s which is a lightweight Kubernetes.

curl -sfL https://get.k3s.io | sh -

Check for Ready node, takes maybe 30 seconds: 
k3s kubectl get node

If necessary to start again k3s: sudo k3s server &

## Download this project

This project contains a web service coded in Java, but the language doesn't matter. 
This project has already been built and the binary version is there:

First of all, download the project: git clone https://github.com/charroux/kubernet
Then move to the sud directory with kubernetes/MyService
where a DockerFile is. 

## Test this project using Docker

Build the docker image: docker build -t my-service .

Check the image: docker images

Start the container: docker run –p 4000:8080 –t my-service

8080 is the port of the web service, while 4000 is the port for accessing the container. 
Test the web service using a web browser: http://localhost:4000

Ctr-C to stop the Web Service.

It displays hello.

Check the containerID: docker ps

Stop the container: docker stop containerID

## Publish the image to the Dccker Hub (optional) 

Retreive the image ID: docker images

Tag the docker image: docker tag imageID yourDockerHubName/imageName:version

Example: docker tag 1dsd512s0d myDockerID/my-service:1

Login to docker hub: docker login

Push the image to the docker hub: docker push yourDockerHubName/imageName:version

Example: docker push myDockerID/my-service:1

## Kubernetes 

Deploying the app to the Kubernetes cluster from the docker image: kubectl create deployment my-service --image yourDockerHubName/imageName:version

Example: kubectl create deployment my-service --image myDockerID/my-service:1

Check the pod: kubectl get pods

Check is the state is running.

Expose the Deployment through a service: kubectl expose deployment my-service --port 8080

Traefik (included into k3s) is the Ingress controller.

Get the external ip address of the load balancer: kubectl get svc --all-namespaces 

Information about the load balancer appears like: kube-system   traefik      LoadBalancer   10.43.145.104   10.0.2.15      80:31596/TCP,443:31539/TCP   33d

Where 10.0.2.15 is the external ip address.

To route incoming request to your service running in the pod a yaml file is required. This file is provided in the kubernetes folder (the parent folder to MyService).

apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: my-service
spec:
  rules:
    - host: my-service.10.0.2.15.xip.io
      http:
        paths:
          - path: /
            backend:
              serviceName: my-service
              servicePort: 8080

Note the use of the domain xip.io which is a magic domain name that provides wildcard DNS for any IP address
               
Change the ip address 10.0.2.15 according to the external ip address. Then use the command: kubectl apply -f my-ingress.yaml

Test the access from a web browser: my-service.10.0.2.15.xip.io

