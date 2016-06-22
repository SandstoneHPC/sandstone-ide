import tornado.web



class BaseHandler(tornado.web.RequestHandler):
    
    def get_current_user(self):
        return self.get_secure_cookie('user')
    
    def get_template_path(self):
        return self.settings['project_dir']

