import tornado.web
from lib.handlers.base import BaseHandler
from lib.mixins.db_mixin import DBMixin



class EditorHandler(BaseHandler):

    @tornado.web.authenticated
    def get(self):
        self.render('apps/codeeditor/templates/editor.html')


class EditorTabHandler(BaseHandler):

    @tornado.web.authenticated
    def get(self):
        enumeration = self.get_argument('enumeration')
        filename = self.get_argument('filename')
        filepath = self.get_argument('filepath')
        is_active = self.get_argument('isActive') == 'true'

        ctx = {
            'enumeration':enumeration,
            'filename':filename,
            'filepath':filepath,
            'is_active':is_active,
        }

        self.render('apps/codeeditor/templates/editortab.html',**ctx)
