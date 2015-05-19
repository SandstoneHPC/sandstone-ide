import os
import datetime
import tornado.web
from oide.lib.handlers.base import BaseHandler
from oide.lib.mixins.db_mixin import DBMixin

import oide.settings as global_settings



class MainHandler(BaseHandler, DBMixin):

    @tornado.web.authenticated
    def get(self):
        ctx = {}
        self.render('lib/templates/oide.html', **ctx)
