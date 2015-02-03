import tornado.web



class DBMixin(tornado.web.RequestHandler):
    
    def initialize(self):
        self.db = self.application.database
        
