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

node('docker') {
    try {
        wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
            stage 'Checkout'

            checkout scm

            env.GIT_COMMIT = git.commit()
            env.GIT_SHORT_COMMIT = git.short_commit()
            env.GIT_VERSION = git.version()

            stage 'Build'

            docker.login()
            sh "docker build -t sketchfab/swagger-ui-builder:${env.GIT_VERSION} ."

            if (env.BRANCH_NAME == 'master') {
                stage 'Deploy'
                sh "docker tag sketchfab/swagger-ui-builder:${env.GIT_VERSION} sketchfab/swagger-ui-builder:latest"
                sh "docker push sketchfab/swagger-ui-builder:${env.GIT_VERSION}"
                sh "docker push sketchfab/swagger-ui-builder:latest"

                slack.notify('Docker Image sketchfab/swagger-ui-builder successfully pushed to hub.docker.com', [color: 'success'])
            }
        }

    } catch (err) {
        slack.notify('Error when building Docker Image sketchfab/swagger-ui-builder', [color: 'error'])
        throw err
    }
}
