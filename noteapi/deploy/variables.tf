variable "prog_name" {
  type          = string
  description   = "Name of Program"
}

variable "region" {
  type          = string
  description   = "Region in which to create resources"
}

variable "subnet_ids" {
  type          = list(string)
  description   = "Array of subnet ids"
}

variable "security_group_ids" {
  type          = list(string)
  description   = "Array of security_group_ids" 
}

variable "sessionName" {
 type = string
 description = "DB Env Var"
}

variable "sessionSecret" {
 type = string
 description = "DB Env Var"
}

variable "maxSessionDays" {
 type = string
 description = "DB Env Var"
}

variable "send_email" {
 type = string
 description = "DB Env Var"
}

variable "userpoolId" {
 type = string
 description = "DB Env Var"
}

variable "appClientId" {
 type = string
 description = "DB Env Var"
}

variable "cognitoOauthUrl" {
 type = string
 description = "DB Env Var"
}

variable "note_host" {
 type = string
 description = "DB Env Var"
}
variable "note_database" {
 type = string
 description = "DB Env Var"
}
variable "note_user" {
 type = string
 description = "DB Env Var"
}
variable "note_password" {
 type = string
 description = "DB Env Var"
}
variable "email_sender" {
 type = string
 description = "DB Env Var"
}
variable "email_hash_key" {
 type = string
 description = "DB Env Var"
}
variable "unsub_url" {
 type = string
 description = "DB Env Var"
}

variable "debug" {
 type = string
 description = "DB Env Var"
}
variable "port" {
 type = string
 description = "Only used for local development"
}
variable "certificate_arn" {
 type = string
 description = "API Gateway Certificate ARN"
}

variable "domain_name" {
 type = string
 description = "API Gateway Domain Name"
}