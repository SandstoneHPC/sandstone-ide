import os
import datetime
import tornado.web
import oide.lib.decorators
from oide.lib.handlers.base import BaseHandler



class MainHandler(BaseHandler):

    @oide.lib.decorators.authenticated
    def get(self):
        ctx = {}
        self.render('lib/templates/oide.html', **ctx)
