import os

APP_DIRECTORY = os.path.dirname(os.path.abspath(__file__))

APP_SPECIFICATION = {
    'APP_DESCRIPTION': {
        'name': 'Terminal',
        'link': '/#/terminal',
        'description': 'The ShellInABox web terminal.'
    },
    'NG_MODULE_NAME': 'terminal',
    'NG_MODULE_STYLESHEETS': (
        'terminal.css',
    ),
    'NG_MODULE_SCRIPTS': (
        'terminado.js',
        'terminal.js',
    ),
}

SHELLINABOX_URL = 'http://localhost:10443'

try:
    from local_settings import *
except:
    pass
