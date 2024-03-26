  // Set up CORS for local dev (Deployed Lambda uses API Gateway CORS settings in config.tf)
  const allowedOrigins = [
    'https://dev-notifications-frontend.ashevillenc.gov', // dev frontend
    'https://notifications.ashevillenc.gov',              // prod frontend
    'http://localhost:3000',                               // local frontend
    'https://dev-notify.ashevillenc.gov',                 // dev sandbox
    'https://notify-api.ashevillenc.gov',                 // prod sandbox
    'http://localhost:4000',                               // local sandbox
    "https://1mut6b8e11.execute-api.us-east-1.amazonaws.com",
  ];

  const corsOptions = {
    origin: function (origin, callback) {
      // console.log("orig", origin);
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`))
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type',
    credentials: true,
  };

  export default corsOptions;
  