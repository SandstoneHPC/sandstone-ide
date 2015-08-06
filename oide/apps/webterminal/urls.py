from terminado import SingleTermManager
from oide.apps.webterminal.handlers import AuthTermSocket


term_manager = SingleTermManager(shell_command=['bash'])

URL_SCHEMA = [
            (r"/terminal/a/term", AuthTermSocket,
                    {'term_manager': term_manager})
        ]
