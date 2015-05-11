import os
import pwd
import subprocess
from simplepam import authenticate

import settings as global_settings


class AuthPam():
    @staticmethod
    def authenticate(un, pw):
        authenticated = authenticate(un, str(pw), service='login')
        if authenticated:
            pw_record = pwd.getpwnam(un)
            python_bin_path = os.path.join(
                os.path.dirname(global_settings.PYTHON_BIN),
                'python'
            )
            script_path = os.path.join(global_settings.PROJECT_DIR,'oidefsd.py')
            fs_user_d = subprocess.Popen(
                'su -m {0} -c "(nohup {2} {1} {0} &)"'.format(
                    pw_record.pw_name,
                    script_path,
                    python_bin_path
                ),
                shell=True
            )
        return authenticated
