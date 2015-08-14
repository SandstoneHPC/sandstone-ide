import os
import oide.settings as global_settings

APP_DIRECTORY = os.path.dirname(os.path.abspath(__file__))

FILESYSTEM_ROOT_DIRECTORIES = (
    '/home/%(username)s/',
    '/tmp/',
    )
    
try:
    from local_settings import *
except:
    pass
