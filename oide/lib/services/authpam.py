import os
import pwd
import subprocess
import logging
from simplepam import authenticate

import oide.settings as global_settings
from oide.lib.app_loader import get_installed_app_cmds


class AuthPam():
    def __init__(self):
        self.auth_user = pwd.getpwuid(os.getuid()).pw_name
        self.user_pids = {}

    def authenticate(self, un, pw):
        import pdb; pdb.set_trace()
        authenticated = authenticate(un, str(pw), service='login')
        if authenticated:
            pw_record = pwd.getpwnam(un)

            for cmd in get_installed_app_cmds():
                formatted_cmd = cmd%{'username':pw_record.pw_name}
                if self.auth_user != pw_record.pw_name:
                    formatted_cmd = 'su -m {0} -c "{1}"'.format(
                        pw_record.pw_name,
                        formatted_cmd
                    )

                try:
                    user_d = subprocess.Popen(
                        formatted_cmd,
                        shell=True
                    ).pid
                except OSError:
                    logging.error(
                        'Failed to run daemon as user {}'.format(pw_record.pw_name)
                    )

                try:
                    user_pid_list = self.user_pids[pw_record.pw_name]
                except KeyError:
                    self.user_pids[pw_record.pw_name] = []
                    user_pid_list = self.user_pids[pw_record.pw_name]
                user_pid_list.append(user_d)

        return authenticated

    def print_pids_for_user(self, un):
        pw_record = pwd.getpwnam(un)
        try:
            for pid in self.user_pids[pw_record.pw_name]:
                print pid
        except KeyError:
            print 'No PIDs for user %s'%pw_record.pw_name


    def logout(self, un):
        pw_record = pwd.getpwnam(un)

        try:
            user_pid_list = self.user_pids[pw_record.pw_name]
            for pid in user_pid_list:
                try:
                    os.kill(pid, signal.SIGKILL)
                except OSError:
                    logging.error('Failed to kill process {} for user {}'.format(pid,un))
            del self.user_pids[pw_record.pw_name]
        except KeyError:
            pass
