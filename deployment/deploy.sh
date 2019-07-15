# Install the services
cp ./notifications1.service /etc/systemd/system/
cp ./notifications2.service /etc/systemd/system/

# Start the services and enable starting after reboot
systemctl start notifications1
systemctl enable notifications1
systemctl start notifications2
systemctl enable notifications2

# Install the NGINX configuration file
cp ./converse.conf /etc/nginx/conf.d/
sudo systemctl restart nginx

