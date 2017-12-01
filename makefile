-include ./settings.ini

develop:
	@/bin/bash -c "source $(venv_dir)/bin/activate&&python run.py runserver"


prod:
	@/bin/bash -c "./gunicorn_start.sh&"

prod-stop:
	@kill `cat $(app_name).pid`&&echo "Terminé."


shell:
	@/bin/bash -c "source $(venv_dir)/bin/activate&&python run.py shell"