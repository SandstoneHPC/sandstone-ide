import tornado.web
from lib.handlers.base import BaseHandler



class AlertsHandler(BaseHandler):
    
    # @tornado.web.authenticated
    def get(self):
        alert_type = self.get_argument('alertType')
        alert_message = self.get_argument('alertMessage')
        ctx = {
            'alert_message':alert_message,
            'alert_type':alert_type
        }
        
        self.render('lib/templates/alert.html',**ctx)
