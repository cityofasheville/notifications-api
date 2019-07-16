#log in as apiadmin
git pull
 #and then as root
systemctl restart devnotifications1
systemctl restart devnotifications2

# or for production:
systemctl restart notifications1
systemctl restart notifications2
