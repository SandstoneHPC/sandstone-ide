import os

APP_DIRECTORY = os.path.dirname(os.path.abspath(__file__))

APP_SPECIFICATION = {
    'APP_DESCRIPTION': {
        'name': 'Remote Desktop',
        'link': '/#/vnc',
        'description': 'noVNC remote desktop.'
    },
    'NG_MODULE_NAME': 'vnc',
    'NG_MODULE_STYLESHEETS': (
        'vnc.css',
    ),
    'NG_MODULE_SCRIPTS': (
        'bower_components/angular-no-vnc/dist/angular-noVNC.js',
        'vnc.js',
    ),
}

VNC_HOST = 'localhost'
VNC_PORT = '59002'
