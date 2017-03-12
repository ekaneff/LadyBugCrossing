#!/bin/sh

DIRECTORY="/var/www/html/musicapi"

if [ ! -d "$DIRECTORY" ]; then
	cd /var/www/html
	mkdir musicapi
	cd /
fi