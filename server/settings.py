import os
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
PYTHON_BIN="/usr/bin/python"


DEBUG = True
LOGIN_URL = '/auth/login'
COOKIE_SECRET = 'YouShouldProbablyChangeThisValueForYourProject'

SHELLINABOX_URL = 'http://localhost:10443'

VNC_HOST = 'localhost'
VNC_PORT = '59002'
VNC_TEST_PASSWD = 'oide_testpasswd'

MONGO_URI = 'localhost'
MONGO_PORT = 27017

PYRO_NAMESERVER_HOST = 'localhost'
PYRO_NAMESERVER_PORT = 9090
PYRO_AUTHMODULE_URI = 'auth.pam'
PYRO_FSMODULE_URI = 'fs.userd.%(username)s'

INSTALLED_MODULES = (
        {
            'name': 'Editor',
            'link': '/#/editor',
            'description': 'A simple online editor for your code and other files.'
        },
        {
            'name': 'Terminal',
            'link': '/#/terminal',
            'description': 'The ShellInABox web terminal.'
        },
        {
            'name': 'Remote Desktop',
            'link': '/#/vnc',
            'description': 'noVNC remote desktop.'
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
