#!/bin/bash
set -e
cd backend

# Demo no Render: SQLite efêmero, recriado a cada boot.
if [ "${DEMO_SQLITE:-True}" = "True" ]; then
  export DB_ENGINE="django.db.backends.sqlite3"
  export SQLITE_PATH="${SQLITE_PATH:-/tmp/easycar.sqlite3}"
fi

python manage.py migrate --noinput
python manage.py seed
exec gunicorn easycar.wsgi:application
