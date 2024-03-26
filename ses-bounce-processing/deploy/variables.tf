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