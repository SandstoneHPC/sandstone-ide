import os
import datetime
import tornado.web
from lib.handlers.base import BaseHandler
from lib.mixins.db_mixin import DBMixin

import settings as global_settings



class MainHandler(BaseHandler, DBMixin):

    @tornado.web.authenticated
    def get(self):
        # self.redirect('/codeeditor')
        ctx = {
            'gateone_static_url': global_settings.GATEONE_STATIC_URL
        }
        self.render('lib/templates/oide.html', **ctx)
