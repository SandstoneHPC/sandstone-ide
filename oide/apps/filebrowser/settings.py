import os
import oide.settings as global_settings

APP_DIRECTORY = os.path.dirname(os.path.abspath(__file__))

PYRO_FSMODULE_URI = 'fs.userd.%(username)s'

FILESYSTEM_ROOT_DIRECTORIES = (
    '/home/%(username)s/',
    '/tmp/',
    )

NGINX_UPLOAD_DIR = '/tmp/oide-upload'

POST_AUTH_COMMANDS = (
    "(nohup " + global_settings.PYTHON_BIN +
        " " + os.path.join(APP_DIRECTORY,"oidefsd.py") +
        " %(username)s &)",
)
