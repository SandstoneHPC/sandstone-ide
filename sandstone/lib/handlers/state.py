import os
import tornado.web
import tornado.escape
import sandstone.lib.decorators
from sandstone.lib.handlers.base import BaseHandler



class StateHandler(BaseHandler):

    def verify_statefile(self):
        state_dir = os.path.expandvars('$HOME/.sandstone/')
        if not os.path.exists(state_dir):
            os.makedirs(state_dir)
        state_path = os.path.join(state_dir,'state.json')
        if not os.path.exists(state_path):
            sf = open(state_path,'w')
            sf.write('{}')
            sf.close()
        self.state_path = state_path

    @sandstone.lib.decorators.authenticated
    def get(self):
        self.verify_statefile()
        with open(self.state_path,'r') as sf:
            state = sf.read()
            if state[-1] == '\n':
                state = state[:-1]
            self.write(state)

    @sandstone.lib.decorators.authenticated
    def post(self):
        state = self.request.body
        self.verify_statefile()
        with open(self.state_path,'w') as sf:
            sf.write(state)
