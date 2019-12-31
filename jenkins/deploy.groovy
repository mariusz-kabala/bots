def branch = '';

pipeline {
    agent { docker { image 'docker-registry.kabala.tech/alpine-terraform:latest' } }
    
    environment {
        RC_PASS = credentials('jira-bot-rocket-chat-pass')
        JIRA_USERNAME = credentials('jira-username')
        JIRA_PASSWORD = credentials('jira-token')
        CI = 'true'
        GIT_SSH_COMMAND = "ssh -o StrictHostKeyChecking=no"
    }

    stages {
        stage ('Prepare') {
            steps {
                script {
                    sh "printenv"
                }
            }
        }
        stage ('Deploy') {
            steps {
                dir("packages/${package}/terraform") {
                    script {
                        docker.withRegistry('https://docker-registry.kabala.tech', 'docker-registry-credentials') {
                            sh "terraform init"
                            sh "terraform plan -out deploy.plan -var=\"tag=${version}\" -var=\"RC_PASS=${RC_PASS}\" -var=\"JIRA_USERNAME=${JIRA_USERNAME}\" -var=\"JIRA_PASSWORD=${JIRA_PASSWORD}\""
                            sh "terraform apply -auto-approve deploy.plan"
                        }
                    }
                }
            }
        }
    }
}
