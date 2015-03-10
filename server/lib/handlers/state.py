import tornado.web
from lib.handlers.base import BaseHandler
from lib.mixins.db_mixin import DBMixin



class StateHandler(BaseHandler,DBMixin):

    @tornado.web.authenticated
    def get(self):
        # import pdb; pdb.set_trace()
        editor_state = self.db.editor_states.find_one(
            {'username':self.current_user}
        )
        if editor_state:
            del editor_state['_id']
            self.write(editor_state)
        else:
            self.write({})

    @tornado.web.authenticated
    def post(self):
        open_files = self.get_argument('state')

        key = {'username':self.current_user}
        data = state
        self.db.editor_states.update(key, data, upsert=True);
