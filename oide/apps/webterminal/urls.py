from oide.apps.webterminal.handlers import NewTerminalHandler
from oide.apps.webterminal.handlers import TerminalPageHandler



URL_SCHEMA = [
            (r"/terminal/a/new/?", NewTerminalHandler),
            (r"/terminal/a/(\w+)/?", TerminalPageHandler),
        ]
