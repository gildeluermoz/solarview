Pre-requis serveur
==================

::

    su - 
    apt-get install apache2 libapache2-mod-proxy-html curl python-dev python-pip libpq-dev supervisor
    pip install virtualenv

* Installer npm pour debian 7 et 8


  ::  
        
        su -
        sh -c 'echo "" >> /etc/apt/sources.list'
        sh -c 'echo "#Backports" >> /etc/apt/sources.list'
        sh -c 'echo "deb http://http.debian.net/debian wheezy-backports main" >> /etc/apt/sources.list'
        apt-get update
        aptitude -t wheezy-backports install nodejs
        update-alternatives --install /usr/bin/node nodejs /usr/bin/nodejs 100
        curl https://www.npmjs.com/install.sh | sh
        exit


* Installer npm pour debian 9


  ::  
        
        curl -sL https://deb.nodesource.com/setup_6.x | sudo bash -
        sudo apt install nodejs


Configuration Apache
====================

* Voici une des manières de configurer Apache via le fichier ``/etc/apache2/sites-available/000-default.conf``. Vous pouvez aussi créer un virtualhost dédié à l'application.

Editer le fichier de configuration Apache ou en créer un nouveau :

::

    #Nom du fichier indiqué à titre d'exemple
    sudo nano /etc/apache2/sites-available/000-default.conf
    
Rajouter les informations suivantes entre les balises VirtualHost

::

    # Configuration de l'application solaire
    RewriteEngine  on
    RewriteRule    "solaire$"  "solaire/"  [R]
    <Location /solaire>
        ProxyPass  http://127.0.0.1:9000/
        ProxyPassReverse  http://127.0.0.1:9000/
    </Location>
    #FIN de configuration de l'application solaire


* Activer les modules et redémarrer Apache
 
  ::  
  
        sudo a2enmod proxy
        sudo a2enmod proxy_http
        sudo a2enmod rewrite
        sudo apache2ctl restart


Installation de l'application
=============================

* Créer et mettre à jour le fichier ``settings.ini``
 
  ::  
  
        cd solaire
        cp settings.ini.sample settings.ini
        nano settings.ini

* Copier le fichier exemple ``data/regul/solar.db``
 
  ::  
  
        cp data/regul/solar.db.sample data/regul/solar.db

* Créer et mettre à jour le fichier ``config.py`` et donner le chemin vers la base de données sqlite
 
  ::  
  
        cp config.py.sample config.py
        nano config.py

* Installer les librairies js et css de l'application
 
  ::  
  
        cd static/
        npm install
        cd ..

* Installer le virtualenv (le chemin ``venv`` doit être le même que dans ``settings.ini``)
    * python2

    ::

        virtualenv venv

    * python 3

    ::

        virtualenv -p /usr/bin/python3 venv

* Installer les librairies python

    ::

        source venv/bin/activate
        pip install -r requirements.txt
        deactivate

* Configuration de supervisor

    ::

        sudo -s cp solaire-service.conf /etc/supervisor/conf.d/

Dans le fichier ``/etc/supervisor/conf.d/solaire-service.conf`` remplacer ``APP_PATH`` par le chemin absolu vers l'application et le fichier ``gunicorn_start.sh``

* Lancement de l'application

    ::
    
        sudo -s supervisorctl reread
        sudo -s supervisorctl reload
        make prod

Création de la base de données
==============================

La base de l'application peut être créée à partir d'un répertoire de fichier produit par la régulation solaire. Ce répertoire est organisé en ``annee/mois/<un_fichier_cvs_par_jour>``

* Placer ce répertoire de fichier de l'année dans le répertoire ``static/data/regul``. Par exemple ``static/data/regul/17``

* Lancer la commande

    ::

        cd static/data/regul
        ./import_data.py solar.db "/home/myuser/solaire/static/data/regul/17/"

Ceci devrait produire une base de données sqlite3 que vous pouvez consulter avec un logiciel comme "DB Browser for SQLite".
Pour le moment, le script ne permet pas d'importer plusieurs années.
