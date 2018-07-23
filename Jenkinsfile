#!/usr/bin/env groovy
@Library('sketchfab@master')
import sketchfab.docker.Docker
import sketchfab.git.Git
import sketchfab.notify.Slack

def docker = new Docker()
def slack = new Slack()
def git = new Git()

env.GITHUB_URL = 'https://github.com/sketchfab/swagger-ui'

env.SLACK_DEFAULT_CHANNEL = '#ops'
env.SLACK_DEFAULT_USERNAME = 'jenkins'
env.SLACK_DEFAULT_TITLE = 'API documentation docker image'
env.SLACK_DEFAULT_TITLE_LINK = "${env.BUILD_URL}"
env.SLACK_DEFAULT_TITLE_ICON = ':docker:'
env.SLACK_DEFAULT_AUTHOR = 'API:Docs'
env.SLACK_DEFAULT_AUTHOR_LINK = ''
env.SLACK_DEFAULT_AUTHOR_ICON = ''

def ecr_registry = docker.getECRRegistry()
def swagger_image = "${ecr_registry}/sketchfab/swagger-ui-builder"

node('docker') {
    try {
        wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
            stage('Checkout') {
                checkout scm

                env.GIT_COMMIT = git.commit()
                env.GIT_SHORT_COMMIT = git.short_commit()
                env.GIT_VERSION = git.version()
            }

            stage('Build') {
                docker.ecr_login()
                sh "docker build -t ${swagger_image}:${env.GIT_VERSION} ."

                if (env.BRANCH_NAME == 'master') {
                    stage('Deploy') {
                        sh("docker tag ${swagger_image}:${env.GIT_VERSION} ${swagger_image}:latest")
                        sh("docker push ${swagger_image}:${env.GIT_VERSION}")
                        sh("docker push ${swagger_image}:latest")

                        slack.notify("Docker image ${swagger_image} successfully pushed to ECR", [color: 'success'])
                    }
                }
            }
        }
    } catch (err) {
        slack.notify('Error when building Docker image ${swagger_image}', [color: 'error'])
        throw err
    }
}
