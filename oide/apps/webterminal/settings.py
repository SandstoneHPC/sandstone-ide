import os

APP_DIRECTORY = os.path.dirname(os.path.abspath(__file__))

APP_SPECIFICATION = {
    'APP_DESCRIPTION': {
        'name': 'Terminal',
        'link': '/#/terminal',
        'description': 'An easy-to-use web-based SSH terminal.'
    },
    'NG_MODULE_NAME': 'terminal',
    'NG_MODULE_STYLESHEETS': (
        'terminal.css',
    ),
    'NG_MODULE_SCRIPTS': (
        'terminal.js',
    ),
}

try:
    from local_settings import *
except:
    pass
