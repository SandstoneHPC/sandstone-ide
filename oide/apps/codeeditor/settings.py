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
    ),
}
