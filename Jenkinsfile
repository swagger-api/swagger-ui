def buildLog = "build.log"
def jenkinsCredentialsId = "6b7a2a4e-831b-4713-bcdd-736d23cc6b53"
def jenkinsAccountName = "jenkinsintapp"
def artifactoryCredentialsId = "artifacts.intappx.com"

pipeline {
  agent {
    label 'ubuntu2'
  }

  parameters {
    booleanParam(
      name: 'PRODUCTION',
      defaultValue: false,
      description: 'Is production deployment?'
    )

    booleanParam(
      name: 'RUN_UI_TESTS',
      defaultValue: true,
      description: 'Run UI tests as part of pipeline?'
    )
  }

  stages {
    stage("Prepare Environment") {
      steps {
        sh "printenv"
        sh "echo ${env.GIT_BRANCH}"
        sh "sudo rm -rf node_modules"
        sh "npm install > $buildLog 2>&1"
      }
    }

    stage("Build application") {
      steps {
        script {
          try {
            sh "npm run build > $buildLog 2>&1"
          } finally {
            archiveArtifacts "$buildLog"
          }
        }
      }
    }

    stage("Deploy to artifactory (version)") {
      steps {
        withCredentials([[$class          : 'UsernamePasswordMultiBinding', credentialsId: "$artifactoryCredentialsId",
                          usernameVariable: 'ARTIFACTORY_USERNAME', passwordVariable: 'ARTIFACTORY_PASSWORD']])
          {
            sh "sudo npm run deploy:artifactory:versioned ${ARTIFACTORY_USERNAME} ${ARTIFACTORY_PASSWORD} ${PRODUCTION ? 'gradle-release' : 'gradle-dev-local'} > $buildLog 2>&1"
          }
      }
    }

    stage("Deploy to artifactory (develop)") {
      when {
        environment name: 'PRODUCTION', value: 'false'
      }
      steps {
        withCredentials([[$class          : 'UsernamePasswordMultiBinding', credentialsId: "$artifactoryCredentialsId",
                          usernameVariable: 'ARTIFACTORY_USERNAME', passwordVariable: 'ARTIFACTORY_PASSWORD']])
          {
            sh "sudo npm run deploy:artifactory ${ARTIFACTORY_USERNAME} ${ARTIFACTORY_PASSWORD} gradle-dev-local > $buildLog 2>&1"
          }
      }
    }

    stage("Update target environment") {
      when {
        environment name: 'PRODUCTION', value: 'false'
      }
      steps {
        withCredentials([
          [$class           : 'AmazonWebServicesCredentialsBinding',
           credentialsId    : 'intappxdev',
           accessKeyVariable: 'AWS_ACCESS_KEY_ID',
           secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']
        ]) {
          withEnv(["AWS_DEFAULT_REGION=us-east-1", "AWS_REGION=us-east-1"]) {
            sh "aws s3 sync --acl public-read ./dist s3://platform-platformdev-platformdev-swagger-ui --delete"
          }
        }
      }
    }
  }
}
