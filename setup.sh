#!/bin/sh

DIRECTORY="/var/www/html/ladybug"

if [ ! -d "$DIRECTORY" ]; then
	cd /var/www/html
	mkdir ladybug
	cd /
fi