import sandstone.lib.decorators
from sandstone.lib.handlers.base import BaseHandler
from terminado import TermSocket



class AuthTermSocket(TermSocket,BaseHandler):

    @sandstone.lib.decorators.authenticated
    def get(self, *args, **kwargs):
        return super(AuthTermSocket, self).get(*args, **kwargs)
