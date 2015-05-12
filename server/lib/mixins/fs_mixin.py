import tornado.web
import Pyro4
import settings as global_settings



class FSMixin(tornado.web.RequestHandler):

    def initialize(self):
        pyro_uri = global_settings.PYRO_FSMODULE_URI%{'username':self.current_user}
        self.fs = Pyro4.Proxy('PYRONAME:%s@%s:%d'%(
            pyro_uri,
            global_settings.PYRO_NAMESERVER_HOST,
            global_settings.PYRO_NAMESERVER_PORT
            )
        )
