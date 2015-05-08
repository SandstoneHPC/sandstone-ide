import sys
import Pyro4
from lib.services.commonfs import CommonFS

import settings as global_settings



common_fs=CommonFS

user_dict = {'username':sys.argv[1]}

fs_daemon=Pyro4.Daemon()
ns=Pyro4.locateNS()
uri=fs_daemon.register(common_fs)
ns.register(global_settings.PYRO_FSMODULE_URI%user_dict, uri)

print "Filesystem daemon running for user: %(username)s."%user_dict
fs_daemon.requestLoop()
