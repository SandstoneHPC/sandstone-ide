import tornado.web
import Pyro4
import oide.settings as global_settings
import oide.apps.filebrowser.settings as app_settings



class FSMixin(tornado.web.RequestHandler):

    def initialize(self):
        pyro_uri = app_settings.PYRO_FSMODULE_URI%{'username':self.current_user}
        self.fs = Pyro4.Proxy('PYRONAME:%s@%s:%d'%(
            pyro_uri,
            global_settings.PYRO_NAMESERVER_HOST,
            global_settings.PYRO_NAMESERVER_PORT
            )
        )
