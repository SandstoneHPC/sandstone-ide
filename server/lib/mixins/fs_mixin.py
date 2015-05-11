import tornado.web
import Pyro4
import settings as global_settings



class FSMixin(tornado.web.RequestHandler):

    def initialize(self):
        pyro_uri = global_settings.PYRO_FSMODULE_URI%{'username':self.current_user}
        self.fs = Pyro4.Proxy('PYRONAME:%s'%pyro_uri)
