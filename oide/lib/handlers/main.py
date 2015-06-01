import os
import datetime
import tornado.web
import oide.lib.decorators
from oide.lib.handlers.base import BaseHandler
from oide.lib.mixins.db_mixin import DBMixin

import oide.settings as global_settings



class MainHandler(BaseHandler, DBMixin):

    @oide.lib.decorators.authenticated
    def get(self):
        ctx = {}
        self.render('lib/templates/oide.html', **ctx)
