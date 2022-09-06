## Services - Logstash

Logstash is a server-side data processing pipeline. Contains Kubernetes manifests, implementation using Pulumi, and Jenkinsfile pipeline.

This is a Deployment with 1 replica and a Service exposing port 5044. Data is sent to "elasticsearch.monitoring:9200", see the services-elasticsearch repository for more information.

Before continuing, these services need to be up and running in order to validate correct operation.
- [services-elasticsearch](https://github.com/k8s-cicd-tools/services-elasticsearch)
- [services-kibana](https://github.com/k8s-cicd-tools/services-kibana)
- [services-filebeat](https://github.com/k8s-cicd-tools/services-filebeat) with delivery to logstash.


## How to get started

1. Install kubectl and pulumi.
2. Clone this repo.
3. Run `$ npm install`
4. Run `$ pulumi up` to create the kubernetes resources.
5. Run `$ kubectl get pods` or `$ kubectl get all` to see the status of the pods.
6. Run `$ kubectl logs <pod-name>` to see the logs of the logstash pod.
7. Check the kibana dashboard to see if the logs are being sent to elasticsearch.
8. Run `$ pulumi destroy` to delete the kubernetes resources.

Alternatively, you can use kubectl directly:

```
$ kubectl apply -f path/to/kubernetes/manifests/logstash.yaml
$ kubectl get all 
$ kubectl logs <pod-name>
# Check the kibana dashboard to see if the logs are being sent to elasticsearch.
$ kubectl delete -f path/to/kubernetes/manifests/logstash.yaml
```

Alternatively, you can use the Jenkinsfile to run the pipeline:

| Jenkinsfile                        | Description                                |
|------------------------------------|--------------------------------------------|
| jenkins/Jenkinsfile-pulumi-up      | This will create the kubernetes resources. |
| jenkins/Jenkinsfile-pulumi-destroy | This will delete the kubernetes resources. |

Environment variables required by Jenkins:

| Name                | Description                                |
|---------------------|--------------------------------------------|
| PULUMI_ACCESS_TOKEN | It is the access token to the Pulumi account. It is recommended to create a key with the same name in the credentials manager. |


Other requirements:
1. A jenkins agent with pulumi and kubectl installed and configured to connect to the kubernetes cluster.
2. The agent must have the "pulumi" label
3. Global tool configuration: add a NodeJS 16.17.0 installation with the name "node 16.17.0"
4. Configure the SCM Pipeline script with this repository, select the branch and change the Jenkins file path to the corresponding option to deploy.


## Resources and dependencies

| Name           | Version | Required |
|----------------|---------|----------|
| kubernetes     | 1.23    | yes      |
| pulumi         | 3.38.0  | no       |
| elasticsearch  | 7.17.0  | yes      |
| kibana         | 7.17.0  | yes      |

#### Also:
- create a Kubernetes namespace named "monitoring"

## Support kubernetes versions

| Version k8s | Description | Branch |
|-------------|-------------|---------|
| 1.23        |             | main    |




