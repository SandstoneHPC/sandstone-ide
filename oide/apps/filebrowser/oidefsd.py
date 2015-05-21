import sys
import getpass
import Pyro4
from oide.apps.filebrowser.services.posixfs import PosixFS

import oide.settings as global_settings
import oide.apps.filebrowser.settings as app_settings



def main():
    posix_fs=PosixFS

    user_dict = {'username':getpass.getuser()}

    fs_daemon=Pyro4.Daemon()
    ns=Pyro4.locateNS(
        host=global_settings.PYRO_NAMESERVER_HOST,
        port=global_settings.PYRO_NAMESERVER_PORT
    )
    uri=fs_daemon.register(posix_fs)
    ns.register(app_settings.PYRO_FSMODULE_URI%user_dict, uri)

    print "Filesystem daemon running for user: %(username)s."%user_dict
    fs_daemon.requestLoop()

if __name__ == "__main__":
    main()
