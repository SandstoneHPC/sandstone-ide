import tornado.web
from sandstone.lib.db import sandstone_db



class DBHandler(tornado.web.RequestHandler):
    def prepare(self):
        self.db = sandstone_db
        self.db.connect()
        return super(DBHandler, self).prepare()

    def on_finish(self):
        if not self.db.is_closed():
            self.db.close()
        return super(DBHandler, self).on_finish()
