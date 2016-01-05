from oide.lib.handlers.pam_auth import PAMLoginHandler
from oide.lib.handlers.logout import LogoutHandler
from oide.lib.handlers.main import MainHandler
from oide.lib.handlers.state import StateHandler
from oide.lib.app_loader import DependencyHandler

from oide.lib.app_loader import get_installed_app_urls



APP_SCHEMA = get_installed_app_urls()
URL_SCHEMA = [
            (r"/auth/login", PAMLoginHandler),
            (r"/auth/logout", LogoutHandler),
            (r"/", MainHandler),
            (r"/a/deps", DependencyHandler),
            (r"/a/state", StateHandler),
        ] + APP_SCHEMA
