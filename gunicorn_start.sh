#!/bin/bash

FLASKDIR=$(readlink -e "${0%/*}")

echo "Starting $app_name"
echo "$FLASKDIR"

. "$FLASKDIR"/settings.ini

# activate the virtualenv
cd $FLASKDIR/$venv_dir
source bin/activate

export PYTHONPATH=$FLASKDIR:$PYTHONPATH


# Start your unicorn
exec gunicorn  run:app --error-log /tmp/errors.log --pid="${app_name}.pid" -w "${gun_num_workers}"  -b "${gun_host}:${gun_port}"  -n "${app_name}"
