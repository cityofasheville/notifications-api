  // Set up CORS
  const allowedOrigins = [
    'https://dev-notifications-frontend.ashevillenc.gov', // dev frontend
    'https://notifications.ashevillenc.gov',              // prod frontend
    'http://localhost:3000',                               // local frontend
    'https://dev-notify.ashevillenc.gov',                 // dev sandbox
    'https://notify-api.ashevillenc.gov',                 // prod sandbox
    'http://localhost:4000',                               // local sandbox
    'http://localhost:4001',                               // local sandbox
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
    credentials: true,
  };

  export default corsOptions;