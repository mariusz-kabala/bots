provider "docker" {
    host = "tcp://192.168.0.33:2376/"
}

terraform {
  backend "s3" {
    bucket = "kabalatech-terraform"
    key    = "bots_jira.tfstate"
    region = "nl-ams"
    endpoint = "s3.nl-ams.scw.cloud"
    skip_credentials_validation = true
    skip_region_validation      = true
  }
}
