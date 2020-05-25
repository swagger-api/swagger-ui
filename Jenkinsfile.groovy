#!groovy
// Update stages below to reflect desired vpc node label names.  Add/remove stage as needed.

// For each desired stage update the description and agent label name (ie vpc label).  Add/remove stage as needed.
pipeline {
    agent { label 'master' }

    stages {
        // stage will test us-shared label per vpc name
        stage("Test on shared") {
            agent { label 'test' }
            steps {
                script {
                    echo 'Hello World'
                }
            }
        }

        // stage will test us-devl label per vpc name
        stage("Test on devl") {
            agent { label 'test2' }
            steps {
                script {
                    echo 'Hello World'
                }
            }
        }

    }
}
