import os
import oide.settings as global_settings

APP_DIRECTORY = os.path.dirname(os.path.abspath(__file__))

APP_SPECIFICATION = {
    'APP_DESCRIPTION': {
        'name': 'Filebrowser',
        'link': '/#/filebrowser',
        'description': 'A file browser',
    },
    'NG_MODULE_NAME': 'filebrowser',
    'NG_MODULE_STYLESHEETS': (
        'filebrowser.css',
    ),
    'NG_MODULE_SCRIPTS': (
        'filebrowser.js',
        'filetree.controller.js',
    ),
}

FILESYSTEM_ROOT_DIRECTORIES = (
    '/home/%(username)s/',
    '/tmp/',
    )

try:
    from local_settings import *
except:
    pass
