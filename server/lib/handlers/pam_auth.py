import os
import Pyro4
from lib.handlers.base import BaseHandler

import settings as global_settings



class PAMLoginHandler(BaseHandler):

    def get(self):
        self.render('lib/templates/login.html')

    def post(self):
        un = self.get_argument('username')
        pw = str(self.get_argument('password'))
        auth_pam = Pyro4.Proxy('PYRONAME:%s@%s:%d'%(
            global_settings.PYRO_AUTHMODULE_URI,
            global_settings.PYRO_NAMESERVER_HOST,
            global_settings.PYRO_NAMESERVER_PORT
            )
        )

        if auth_pam.authenticate(un, pw):
            self.set_secure_cookie('user', un)
            self.redirect("/")
        else:
            failed_attempts=self.get_secure_cookie("failedattempts")
            if failed_attempts==False or failed_attempts == None:
                failed_attempts=0
            self.set_secure_cookie("failedattempts", str(int(failed_attempts)+1))
            self.render(
                'lib/templates/login.html',
                error='Username or Password incorrect!'
                )
