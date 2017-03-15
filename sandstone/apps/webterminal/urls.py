from terminado import UniqueTermManager
from sandstone.apps.webterminal.handlers import AuthTermSocket



term_manager = UniqueTermManager(max_terminals=3,shell_command=['bash'])

URL_SCHEMA = [
            (r"/terminal/a/term", AuthTermSocket,
                    {'term_manager': term_manager})
        ]
