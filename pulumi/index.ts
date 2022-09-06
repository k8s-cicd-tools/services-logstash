import * as k8s from "@pulumi/kubernetes";
import * as kx from "@pulumi/kubernetesx";
import * as fs from "fs";

const appLabels = {app: "logstash"};

const configMap = new k8s.core.v1.ConfigMap("logstash-configmap", {
    metadata: {
        name: "logstash-configmap",
        namespace: "monitoring",
    },
    data: {
        "logstash.yml": fs.readFileSync("logstash.yml").toString(),
        "logstash.conf": fs.readFileSync("logstash.conf").toString(),
    },
});

const deployment = new k8s.apps.v1.Deployment("logstash-deployment", {
    metadata: {
        name: "logstash-deployment",
        namespace: "monitoring",
    },
    spec: {
        replicas: 1,
        selector: {
            matchLabels: appLabels,

        },
        template: {
            metadata: {
                labels: appLabels,
            },
            spec: {
                containers: [{
                    name: "logstash",
                    image: "docker.elastic.co/logstash/logstash:6.3.0",
                    ports: [{containerPort: 5044}],
                    volumeMounts: [
                        {name: "config-volume", mountPath: "/usr/share/logstash/config"},
                        {name: "logstash-pipeline-volume", mountPath: "/usr/share/logstash/pipeline"},
                    ],
                }],
                volumes: [
                    {
                        name: "config-volume",
                        configMap: {
                            name: "logstash-configmap",
                            items: [{
                                key: "logstash.yml",
                                path: "logstash.yml",
                            }, {
                                key: "logstash.conf",
                                path: "logstash.conf",
                            }],
                        },
                    },
                    {
                        name: "logstash-pipeline-volume",
                        configMap: {
                            name: "logstash-configmap",
                            items: [{
                                key: "logstash.conf",
                                path: "logstash.conf",
                            }],
                        },
                    },
                ],
            },
        },
    },
});

const service = new k8s.core.v1.Service("logstash-service", {
    metadata: {
        name: "logstash-service",
        namespace: "monitoring",
    },
    spec: {
        selector: appLabels,
        ports: [{
            protocol: "TCP",
            port: 5044,
            targetPort: 5044,
        }],
        type: "ClusterIP",
    },
});

export const name = "logstash";

