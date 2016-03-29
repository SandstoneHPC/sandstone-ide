import os
import sys

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
# sys.path.insert(0,PROJECT_DIR)

# If USE_SSL is set to True, then both the SSL_CERT and SSL_KEY
# options need to be configured.
USE_SSL = False
# SSL_CERT = '/path/to/.pem'
# SSL_KEY = '/path/to/.pem'

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
    local_settings_file = os.environ['OIDE_SETTINGS']
    if local_settings_file not in sys.path:
        sys.path.insert(0,os.path.dirname(local_settings_file))
    from oide_settings import *
    # __import__('oide_settings', globals(), locals(), ['*'])
except:
    pass
