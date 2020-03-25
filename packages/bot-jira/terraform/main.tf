resource "docker_container" "bot-jira" {
  name  = "bot-jira"
  image = "docker-registry.kabala.tech/bots/jira:${var.tag}"
  restart = "always"
  networks_advanced {
      name = "kabala-net"
  }
  env = [
      "RC_HOST=chat.kabala.tech",
      "RC_USER=jira",
      "RC_PASS=${var.RC_PASS}",
      "RC_SSL=1",
      "RC_ROOMS=general,jira",
      "JIRA_PROTOCOL=https",
      "JIRA_HOST=geotags.atlassian.net",
      "JIRA_USERNAME=${var.JIRA_USERNAME}",
      "JIRA_PASSWORD=${var.JIRA_PASSWORD}",
      "JIRA_API_VERSION=2",
      "DAILY_REPORT_UPDATE_TIME=00 25 10 * * 1-5"
  ]
}
