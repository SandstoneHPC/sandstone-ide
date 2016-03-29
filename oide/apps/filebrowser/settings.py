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
        'filetree.service.js',
        'filebrowser.controller.js',
    ),
}

FILESYSTEM_ROOT_DIRECTORIES = (
    '/home/%(username)s/',
    '/tmp/',
    )

try:
    local_settings_file = os.environ['OIDE_SETTINGS']
    if local_settings_file not in sys.path:
        sys.path.insert(0,os.path.dirname(local_settings_file))
    from oide_settings import *
    # __import__('oide_settings', globals(), locals(), ['*'])
except:
    pass
