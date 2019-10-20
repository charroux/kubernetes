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

First of all, download the project: git clone https://github.com/charroux/kubernetes

Then move to the sud directory with cd kubernetes/MyService
where a DockerFile is. 

## Test this project using Docker

Build the docker image: docker build -t my-service .

Check the image: docker images

Start the container: docker run –p 4000:8080 –t my-service

8080 is the port of the web service, while 4000 is the port for accessing the container. 
Test the web service using a web browser: http://localhost:4000
It displays hello.


Ctr-c to stop the Web Service.


Check the containerID: docker ps

Stop the container: docker stop containerID

## Publish the image to the Docker Hub

Retreive the image ID: docker images

Tag the docker image: docker tag imageID yourDockerHubName/imageName:version

Example: docker tag 1dsd512s0d myDockerID/my-service:1

Login to docker hub: docker login

Push the image to the docker hub: docker push yourDockerHubName/imageName:version

Example: docker push myDockerID/my-service:1

## Kubernetes 

Deploying the app to the Kubernetes cluster from the docker image: kubectl create deployment my-service --image yourDockerHubName/imageName:version

Example: kubectl create deployment my-service --image myDockerID/my-service:1

See the yaml generated file: kubectl get deployments my-service -o yaml

Check the pod: kubectl get pods

Check if the state is running.

## Deleting kubernetes resources

Deleting a pod with the command "kubectl delete pods podsName" is not enough since a pod car restart automatically.
You shoud delete the deployement and the related services. First get all the resources with: kubectl get all
You should obtain something like that:

AME                                       READY   STATUS    RESTARTS   AGE
pod/my-service-bb8976d4d-5qrf7             1/1     Running   0          35s

NAME                 TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
service/my-service   ClusterIP   10.43.16.240   <none>        8080/TCP   10d

NAME                                  READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/my-service            1/1     1            1           10d

NAME                                             DESIRED   CURRENT   READY   AGE
replicaset.apps/my-service-bb8976d4d             1         1         1       10d

Then delete the deployment and the related service with: kubectl delete deployment.apps/my-service service/my-service

## Edition of a deployement file

A basic deployment file can be create like that: https://github.com/charroux/kubernetes/blob/master/my-service-deployment.yml

Note how the app is selected (app: my-service) and the kind Deployment.

Then to deploy the app use: kubectl apply -f my-service-deployment.yml

Check if the state is running with: kubectl get pods

## Expose the Deployment through a service

A service can be described by: https://github.com/charroux/kubernetes/blob/master/my-service-service.yml

Where targetPort: 8080 is the port of the app already deployed, and 80 is the port of the service. Note also how the app is selected (app: my-service) and the kind Service.

Use 'kubectl apply -f my-service-service.yml' to launch the service.

## Expose HTTP and HTTPS routes from outside the cluster to services within the cluster

Ingress exposes HTTP and HTTPS routes from outside the cluster to services within the cluster. There are many Ingress controllers. Traefik (included into k3s) is one of them.

Such routes can be described in a yaml file: https://github.com/charroux/kubernetes/blob/master/my-service-ingress.yml

Note the kind (Ingress), the choice of Traefik (kubernetes.io/ingress.class: traefik), the choice of the service (serviceName: my-service-service), the associated port (servicePort: http) and the path to that service (path: /). Endeed, note the name of the exposed host (my-service.localhost). This is the external name to get access to the service.

Use this command (to use Traefik): kubectl apply -f my-service-ingress.yml

Finally, check if the app is reachable using the URL: http://my-service.localhost/

## Kubernetes commands overview

https://kubernetes.io/docs/reference/kubectl/cheatsheet/

# Service Mesh with Linkerd

Open a session as root.

The installation procedure https://linkerd.io/2/getting-started/ on k3s must be modified at "linkerd check --pre" step.
Indeed, this step checks the cluster configuration. Linkerd looks for the configuration $HOME/.kube/config but it doesn't exist by default in k3s. Use the following command "kubectl config view --raw > $HOME/.kube/config",
then get back the configuration at step "linkerd check --pre". If "pre-linkerd-global-resources" error occurs, 
then remove the resources with "linkerd install --ignore-cluster | kubectl delete -f -". 
Get back the installation procedure at: "linkerd install | kubectl apply -f -"
