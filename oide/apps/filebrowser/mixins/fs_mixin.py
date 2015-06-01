import tornado.web
from oide.apps.filebrowser.posixfs import PosixFS
import oide.settings as global_settings
import oide.apps.filebrowser.settings as app_settings



class FSMixin(tornado.web.RequestHandler):

    def initialize(self):
        self.fs = PosixFS
