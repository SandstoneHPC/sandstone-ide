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
    local_settings_file = os.environ['OIDE_SETTINGS']
    if local_settings_file not in sys.path:
        sys.path.insert(0,os.path.dirname(local_settings_file))
    from oide_settings import *
    # __import__('oide_settings', globals(), locals(), ['*'])
except:
    pass
