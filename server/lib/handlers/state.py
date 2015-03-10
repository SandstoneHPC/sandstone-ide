import tornado.web
import tornado.escape
from lib.handlers.base import BaseHandler
from lib.mixins.db_mixin import DBMixin



class StateHandler(BaseHandler,DBMixin):

    @tornado.web.authenticated
    def get(self):
        # import pdb; pdb.set_trace()
        state = self.db.states.find_one(
            {'username':self.current_user}
        )
        if state:
            del state['_id']
            self.write(state)
        else:
            self.write({})

    @tornado.web.authenticated
    def post(self):
        state = self.get_argument('state')
        state = tornado.escape.json_decode(state)
        # import pdb; pdb.set_trace()
        key = {'username':self.current_user}
        data = state
        self.db.states.update(key, data, upsert=True);
