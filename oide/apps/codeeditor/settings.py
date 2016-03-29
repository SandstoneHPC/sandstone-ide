import os

APP_DIRECTORY = os.path.dirname(os.path.abspath(__file__))

APP_SPECIFICATION = {
    'APP_DESCRIPTION': {
        'name': 'Editor',
        'link': '/#/editor',
        'description': 'A simple online editor for your code and other files.',
    },
    'NG_MODULE_NAME': 'editor',
    'NG_MODULE_STYLESHEETS': (
        'editor.css',
    ),
    'NG_MODULE_SCRIPTS': (
        'editor.js',
        'editor.service.js',
        'filetree.service.js',
        'ace.controller.js',
        'tabs.controller.js',
        'settings.controller.js',
        'filetree-controls.controller.js',
        'filetree.controller.js',
    ),
}

try:
    local_settings_file = os.environ['OIDE_SETTINGS']
    if local_settings_file not in sys.path:
        sys.path.insert(0,os.path.dirname(local_settings_file))
    from oide_settings import *
    # __import__('oide_settings', globals(), locals(), ['*'])
except:
    pass
