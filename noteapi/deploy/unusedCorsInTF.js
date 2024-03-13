resource "aws_lambda_function_url" "${prog_name}_function_url" {
  function_name      = aws_lambda_function.${prog_name}.function_name
  authorization_type = "NONE"
  cors {
    allow_credentials = false
    allow_origins     = [
    "https://dev-notifications-frontend.ashevillenc.gov",
    "https://notifications.ashevillenc.gov",
    "http://localhost:3000",
    "https://dev-notify.ashevillenc.gov",
    "https://notify-api.ashevillenc.gov",
    "http://localhost:4000",
    "http://localhost:4001"
    ]
    allow_methods     = ["GET", "POST", "HEAD"]
    allow_headers     = ["date", "content-type"]
    max_age           = 86400
  }
}