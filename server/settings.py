import os
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
PYTHON_BIN="/usr/bin/python"


DEBUG = True
LOGIN_URL = '/auth/login'
COOKIE_SECRET = 'YouShouldProbablyChangeThisValueForYourProject'

TERMINAL_API_KEY = 'GateOneAPIKey'
TERMINAL_SECRET = 'GateOneServerSecret'
GATEONE_URL = 'https://localhost:10443'
GATEONE_ORIGINS_URL = 'http://localhost:8888'
GATEONE_STATIC_URL = 'https://remotehost:10443'

MONGO_URI = 'localhost'
MONGO_PORT = 27017

PYRO_AUTHMODULE_URI = 'auth.pam'
PYRO_FSMODULE_URI = 'fs.userd.%(username)s'

INSTALLED_MODULES = (
        {
            'name': 'Editor',
            'link': '/#/editor',
            'description': 'A simple online editor for your code and other files.'
        },
        {
            'name': 'File Browser',
            'link': '/#/filebrowser',
            'description': 'A powerful online file browser.'
        },
        {
            'name': 'Terminal',
            'link': '/#/terminal',
            'description': 'The GateOne web terminal.'
        },
    )

FILESYSTEM_ROOT_DIRECTORIES = (
    '/home/{{USERNAME}}/',
    '/tmp/',
    )

NGINX_UPLOAD_DIR = '/tmp/oide-upload'

try:
    from local_settings import *
except:
    pass
