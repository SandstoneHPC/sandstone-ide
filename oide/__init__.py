import os
import sys
import signal
import subprocess
import app
import settings

__all__ = ['apps','lib','urls','settings','authd']


def run_server():
    app.main()

def run_daemons():
    try:
        ns_cmd = "python -m Pyro4.naming -n %s -p %d &"
        ns_cmd_fmt = ns_cmd%(
            settings.PYRO_NAMESERVER_HOST,
            settings.PYRO_NAMESERVER_PORT
        )
        ns = subprocess.Popen(
            ns_cmd_fmt,
            shell=True
        )

        authd_cmd = "python -m oide.authd &"
        authd = subprocess.Popen(
            authd_cmd,
            shell=True
        )
    except KeyboardInterrupt:
        try:
            for line in os.popen('ps ax | grep Pyro4.naming | grep -v grep'):
                pid = line.split()[0]
                os.kill(int(pid), signal.SIGKILL)
        except OSError:
            pass
        try:
            for line in os.popen('ps ax | grep oide.authd | grep -v grep'):
                pid = line.split()[0]
                os.kill(int(pid), signal.SIGTERM)
        except OSError:
            pass
        sys.exit(0)

def run_all():
    try:
        ns_cmd = "python -m Pyro4.naming -n %s -p %d &"
        ns_cmd_fmt = ns_cmd%(
            settings.PYRO_NAMESERVER_HOST,
            settings.PYRO_NAMESERVER_PORT
        )
        ns = subprocess.Popen(
            ns_cmd_fmt,
            shell=True
        )

        authd_cmd = "python -m oide.authd &"
        authd = subprocess.Popen(
            authd_cmd,
            shell=True
        )

        app.main()
    except KeyboardInterrupt:
        try:
            for line in os.popen('ps ax | grep Pyro4.naming | grep -v grep'):
                pid = line.split()[0]
                os.kill(int(pid), signal.SIGKILL)
        except OSError:
            pass
        try:
            for line in os.popen('ps ax | grep oide.authd | grep -v grep'):
                pid = line.split()[0]
                os.kill(int(pid), signal.SIGTERM)
        except OSError:
            pass
        sys.exit(0)
