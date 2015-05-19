from oide.lib.handlers.base import BaseHandler



class LogoutHandler(BaseHandler):

    def get(self):
        self.clear_cookie('user')
        self.redirect(self.get_argument('next', '/auth/login'))
