#!/bin/bash
cd backend
python manage.py migrate --noinput
python manage.py seed
exec gunicorn easycar.wsgi:application
