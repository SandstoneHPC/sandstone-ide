import os
import datetime
import tornado.web
from lib.handlers.base import BaseHandler
from lib.mixins.db_mixin import DBMixin



class MainHandler(BaseHandler, DBMixin):
    
    @tornado.web.authenticated
    def get(self):
        # self.redirect('/codeeditor')
        self.render('lib/templates/oide.html')
            
