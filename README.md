# kubernetes

Kubernetes (commonly stylized as k8s) is an open-source container-orchestration system for automating application deployment, scaling, and management

## Requirements

Linux. Version used: Ubuntu Disco 19.04
 
## Docker installation

Docker is often used with Kubernetes. Hence, Kubernetes manages a cluster of Docker containers. 

apt  install docker.io


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

Start the container: docker run -p 4000:8080 -t my-service

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

Then delete the deployment and the related service with: kubectl delete deployment.apps/my-service

## Edition of a deployement file

A basic deployment file can be create like that: https://github.com/charroux/kubernetes/blob/master/my-service-deployment.yml

Note how the app is selected (app: my-service) and the kind Deployment.

Then to deploy the app use: kubectl apply -f my-service-deployment.yml

Check if the state is running with: kubectl get pods

When a node dies, the pods die with it.

## Expose the Deployment through a service

A Kubernetes Service is an abstraction which defines a logical set of Pods running somewhere in the cluster, that all provide the same functionality. When created, each Service is assigned a unique IP address (also called clusterIP). This address is tied to the lifespan of the Service, and will not change while the Service is alive.

A service can be described by: https://github.com/charroux/kubernetes/blob/master/my-service-service.yml

Where targetPort: 8080 is the port of the app already deployed, and 80 is the port of the service. Note also how the app is selected (app: my-service) and the kind Service.

Use 'kubectl apply -f my-service-service.yml' to launch the service.

Ask kubectl what are the services : kubectl get services

Then get its cluesterIP with: kubectl get sericeName

Pods are exposed through endpoints and 

kubectl get ep serviceName

get the clusterIP and the port. Then, you should now be able to access the service on <CLUSTER-IP>:<PORT> from any node in the cluster. Note that the Service IP is completely virtual, it never hits the wire.


## Expose HTTP and HTTPS routes from outside the cluster to services within the cluster

Ingress exposes HTTP and HTTPS routes from outside the cluster to services within the cluster. There are many Ingress controllers. Traefik (included into k3s) is one of them.

Such routes can be described in a yaml file: https://github.com/charroux/kubernetes/blob/master/my-service-ingress.yml

Note the kind (Ingress), the choice of Traefik (kubernetes.io/ingress.class: traefik), the choice of the service (serviceName: my-service-service), the associated port (servicePort: http) and the path to that service (path: /). Endeed, note the name of the exposed host (my-service.localhost). This is the external name to get access to the service.

Use this command (to use Traefik): kubectl apply -f my-service-ingress.yml

Finally, check if the app is reachable using the URL: http://my-service.localhost/

Check the Ingress resources : kubectl get ingress

Delete Ingress with: kubectl delete ingress my-service-ingress --namespace default

## Kubernetes commands overview

https://kubernetes.io/docs/reference/kubectl/cheatsheet/

# Service Mesh with Linkerd

You should be connected as root.

The following installation procedure comes from the linkerd site: https://linkerd.io/2/getting-started/

But it should be adapted as follow.

## Step 1: Install the CLI

If this is your first time running Linkerd, you will need to download the command-line interface (CLI) onto your local machine. This CLI interacts with Linkerd, including installing the control plane onto your Kubernetes cluster.

To install the CLI, run:

curl -sL https://run.linkerd.io/install | sh

Next, add linkerd to your path with:

export PATH=$PATH:$HOME/.linkerd2/bin

Verify the CLI is installed and running correctly with:

linkerd version

You should see the CLI version, and also Server version: unavailable. This is because you haven’t installed the control plane on your cluster. Don’t worry, you’ll be installing the control plane soon.

## Step 2: Validate your Kubernetes cluster

Kubernetes clusters can be configured in many different ways. To ensure that the control plane will install correctly, the Linkerd CLI can check and validate that everything is configured correctly.

To check that your cluster is configured correctly and ready to install the control plane, you can run:

linkerd check --pre

This command fails because Linkerd looks for the configuration $HOME/.kube/config but it doesn't exist by default in k3s. Use the following command "kubectl config view --raw > $HOME/.kube/config", to create the expected configuration.

Then get back the configuration at step "linkerd check --pre". 

## Step 3: Install Linkerd onto the cluster

Now that you have the CLI running locally and a cluster that is ready to go, it’s time to install the control plane into its own namespace (by default, linkerd). To do this, run:

linkerd install | kubectl apply -f -

If "pre-linkerd-global-resources" error occurs, then remove the resources with "linkerd install --ignore-cluster | kubectl delete -f -". Get back the installation procedure at: "linkerd install | kubectl apply -f -"

The linkerd install command generates a Kubernetes manifest with all the necessary control plane resources. (You can inspect the output if desired!). Piping this manifest into kubectl apply will instruct Kubernetes to add those resources to your cluster.

Depending on the speed of your cluster’s Internet connection, it may take a minute or two for your cluster to pull the Linkerd images. While that is happening, we can validate the installation by running:

linkerd check

This command will patiently wait until Linkerd has been installed, is running and becomes healthy. 

## Step 4: Explore Linkerd

With the control plane installed and running, you can now view the Linkerd dashboard by running:

linkerd dashboard &

## Adding a service to Linkerd

First, get the deployment configuration of a deployed service with: kubectl get deployments my-service-deployment -o yaml

Then save is the a file: kubectl get deployments my-service-deployment -o yaml > deployment.yml

To add the data plane proxies to a service defined in a Kubernetes manifest, you can use linkerd inject to add the annotations before applying the manifest to Kubernetes:

cat deployment.yml | linkerd inject - | kubectl apply -f -

Finally, check in the Linkerd dashboard if the depployment is meshed.
