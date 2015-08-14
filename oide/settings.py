import os
import sys

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
# sys.path.insert(0,PROJECT_DIR)

PYTHON_BIN="/usr/bin/python"

# OIDE Core settings
DEBUG = True
LOGIN_URL = '/auth/login'
COOKIE_SECRET = 'YouShouldProbablyChangeThisValueForYourProject' 

# App-Wide settings
INSTALLED_APPS = (
    'oide.apps.codeeditor',
    'oide.apps.filebrowser',
    'oide.apps.webterminal',
)

try:
    from local_settings import *
except:
    pass
