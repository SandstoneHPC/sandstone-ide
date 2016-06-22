import tornado.web
from sandstone.apps.filebrowser.posixfs import PosixFS



class FSMixin(tornado.web.RequestHandler):

    def initialize(self):
        self.fs = PosixFS
