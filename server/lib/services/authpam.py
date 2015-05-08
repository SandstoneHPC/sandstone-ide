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
            fs_user_d = subprocess.Popen(
                'su -m {0} -c python oidefsd.py {0} &'.format(pw_record.pw_name),
                shell=True
            )
        return authenticated
