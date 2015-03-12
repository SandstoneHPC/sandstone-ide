import tornado.web
import tornado.escape
import json
import time
import os

import settings as global_settings
from lib.handlers.base import BaseHandler



class EmbedTerminalHandler(BaseHandler):

    @tornado.web.authenticated
    def get(self):
        if not self.get_secure_cookie('gateone_ssl'):
            self.set_secure_cookie('gateone_ssl','accepted')
            self.redirect(global_settings.GATEONE_STATIC_URL+'/static/accept_certificate.html')
        else:
            secret = global_settings.TERMINAL_SECRET

            authobj = {
                'api_key': global_settings.TERMINAL_API_KEY,
                'upn': self.get_current_user(),
                'timestamp': str(int(time.time() * 1000)),
                'signature': "",
                'signature_method': 'HMAC-SHA1',
                'api_version': '1.0'
            }

            authobj['signature'] = self.create_signature(secret, authobj['api_key'], authobj['upn'], authobj['timestamp'])

            ctx = {
                'json_authobj': authobj,
                'gateone_url': global_settings.GATEONE_URL,
                'gateone_origins_url': global_settings.GATEONE_ORIGINS_URL,
                'gateone_static_url': global_settings.GATEONE_STATIC_URL
                }
            self.write(ctx)

    @tornado.web.authenticated
    def create_signature(self, secret, *parts):
		import hmac, hashlib

		hash = hmac.new(secret, digestmod=hashlib.sha1)
		for part in parts:
			hash.update(str(part))

		return hash.hexdigest()
