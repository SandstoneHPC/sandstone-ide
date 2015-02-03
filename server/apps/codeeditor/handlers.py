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

class EditorStateHandler(BaseHandler,DBMixin):
    
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
            self.write('NO_SAVED_STATE')
    
    @tornado.web.authenticated
    def post(self):
        # import pdb; pdb.set_trace()
        # sessions = self.get_argument('sessions')
        # current_sess = self.get_argument('currentWorkingDocument')
        # num_tabs = self.get_argument('numTabs')
        # editortabs = self.get_argument('editortabs')
        open_files = self.get_argument('openFiles')
        editor_settings = self.get_argument('settings')
        filesystem = self.get_argument('filesystem')
        
        key = {'username':self.current_user}
        data = {
            'username':self.current_user,
            # 'sessions':sessions,
            # 'currentWorkingDocument':current_sess,
            # 'numTabs':num_tabs,
            'filesystem':filesystem,
            'settings':editor_settings,
            # 'editortabs':editortabs
            'openFiles':open_files
        };
        self.db.editor_states.update(key, data, upsert=True);
