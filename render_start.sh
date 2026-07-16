#!/bin/bash
cd backend
python manage.py migrate --noinput 2>&1 || true
python manage.py seed 2>&1 || true
exec gunicorn easycar.wsgi:application
