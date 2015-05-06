import Pyro4
from simplepam import authenticate



class AuthPam():
    def authenticate(self, un, pw):
        return authenticate(un, str(pw), service='login')
