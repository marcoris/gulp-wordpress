# Set environment variable
DEBIAN_FRONTEND=noninteractive

# Update Packages
apt-get update

# Upgrade Packages
apt-get dist-upgrade

sudo rm /etc/localtime && sudo ln -s /usr/share/zoneinfo/Europe/Berlin /etc/localtime

# Apache
apt-get install -y apache2

# Enable Apache Mods
a2enmod rewrite
sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Install PHP
apt-get install -y php7.2

# PHP Apache Mod
apt-get install -y libapache2-mod-php7.2

# Restart Apache
systemctl restart apache2.service

# PHP-MYSQL lib
apt-get install -y mysql-server
apt-get install -y php7.2-mysql

# Install WordPress
wget -c http://wordpress.org/latest.tar.gz
tar -xzvf latest.tar.gz
rm latest.tar.gz
sudo rsync -av wordpress/* /var/www/html/
rm -R wordpress

# Set permissions
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/

# Setup database
sudo mysql -e "GRANT ALL PRIVILEGES ON wordpress.* TO 'wordpress'@'localhost' IDENTIFIED BY 'secret'"
sudo mysql -e "CREATE DATABASE IF NOT EXISTS wordpress"
sudo mysql -e "FLUSH PRIVILEGES"

# Restart Apache
sudo systemctl restart apache2.service

# Set config file
mv /var/www/html/wp-config-sample.php /var/www/html/wp-config.php