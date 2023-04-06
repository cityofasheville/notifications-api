## Problem: different services need different node versions
## Using nvm in services
## Add this to package.json
  "scripts": {
    "systemd": "/home/apiadmin/.nvm/versions/node/v16.15.1/bin/node index.js"
  }

## /etc/systemd/system/devnotifications1.service
### OLD VER
``` conf
[Service]
WorkingDirectory=/opt/devnotifications
ExecStart=/usr/bin/node /opt/devnotifications/index.js
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=devnotifications-1
User=apiadmin
Group=apiadmin
Environment=NODE_ENV=development PORT=5011

[Install]
WantedBy=multi-user.target
```

### NEW VER
``` conf
[Service]
WorkingDirectory=/opt/devnotifications
ExecStart=/usr/bin/npm run systemd
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=devnotifications-1
User=apiadmin
Group=apiadmin
Environment=NODE_ENV=development PORT=5011

[Install]
WantedBy=multi-user.target
```

## /etc/nginx/conf.d/devnotifications.conf 
``` conf
upstream node_server6 {
   server 127.0.0.1:5011 fail_timeout=0;
   server 127.0.0.1:5012 fail_timeout=0;
}

server {
    listen 80;
    server_name dev-notify.ashevillenc.gov;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name dev-notify.ashevillenc.gov;
 
    #ssl on;
    add_header Strict-Transport-Security "max-age=31536000";        
    ssl_certificate /etc/letsencrypt/live/dev-notify.ashevillenc.gov/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dev-notify.ashevillenc.gov/privkey.pem;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH:AES256+ECDHE';
    index index.html index.htm;

#    server_name _;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_redirect off;
        proxy_buffering off;
        proxy_pass http://node_server6;
    }

    location /public/ {
        root /opt/devnotifications;
    }
}
```