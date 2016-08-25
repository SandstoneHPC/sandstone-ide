import os
import tornado.web
from peewee.playhouse.sqlite_ext import SqliteExtDatabase
from sandstone import settings



class DBHandler(tornado.web.RequestHandler):
    def prepare(self):
        if not os.path.exists(settings.DATABASE):
            db_dir = os.path.dirname(settings.DATABASE)
            os.path.makedirs(db_dir)

        self.db = SqliteExtDatabase(settings.DATABASE)
        self.db.connect()
        return super(DBHandler, self).prepare()

    def on_finish(self):
        if not self.db.is_closed():
            self.db.close()
        return super(DBHandler, self).on_finish()
