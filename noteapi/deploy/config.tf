terraform {
  backend "s3" {
    bucket = "avl-tfstate-store"
    key    = "terraform/${prog_name}/layer/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}

# Zip file for Lambda Layer
data "archive_file" "${prog_name}_layer_zip" {
  type        = "zip"
  source_dir  = "${path.module}/nodejs"
  output_path = "${path.module}/layer.zip"
}

# Lambda Layer
resource "aws_lambda_layer_version" "${prog_name}_layer" {
  filename   = "${path.module}/layer.zip"
  source_code_hash = data.archive_file.${prog_name}_layer_zip.output_base64sha256
  layer_name = "${prog_name}_layer"
}

output "${prog_name}_layer_arn" {
  value = aws_lambda_layer_version.${prog_name}_layer.arn
}

# Zip file for Lambda Function
data "archive_file" "${prog_name}_zip" {
  type        = "zip"
  source_dir  = "${path.module}/funcdir"
  output_path = "${path.module}/function.zip"
}

# Lambda Function
resource "aws_lambda_function" "${prog_name}" {
  description      = "${prog_name}" 
  function_name    = "${prog_name}"
  role             = aws_iam_role.${prog_name}-role.arn
  handler          = "lambda.handler"
  runtime          = "nodejs20.x"
  filename = data.archive_file.${prog_name}_zip.output_path
  source_code_hash = data.archive_file.${prog_name}_zip.output_base64sha256
  layers = [aws_lambda_layer_version.${prog_name}_layer.arn]
  timeout          = 30
  memory_size      = 180
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
  tags = {
    Name          = "${prog_name}"
    "coa:application" = "${prog_name}"
    "coa:department"  = "information-technology"
    "coa:owner"       = "jtwilson@ashevillenc.gov"
    "coa:owner-team"  = "dev"
  }
  environment {
    variables = {
      "sessionName": var.sessionName
      "sessionSecret": var.sessionSecret
      "maxSessionDays": var.maxSessionDays
      "send_email": var.send_email
      "userpoolId": var.userpoolId
      "appClientId": var.appClientId
      "cognitoOauthUrl": var.cognitoOauthUrl
      "note_host": var.note_host
      "note_database": var.note_database
      "note_user": var.note_user
      "note_password": var.note_password
      "email_sender": var.email_sender
      "email_hash_key": var.email_hash_key
      "unsub_url": var.unsub_url
    }
  }
}

resource "aws_lambda_function_url" "${prog_name}_function_url" {
  function_name      = aws_lambda_function.${prog_name}.function_name
  authorization_type = "NONE"
}

output "${prog_name}_arn" {
  value = aws_lambda_function.${prog_name}.arn
}

