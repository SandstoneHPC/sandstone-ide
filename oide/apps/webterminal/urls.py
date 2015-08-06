from terminado import TermSocket
from terminado import SingleTermManager


term_manager = SingleTermManager(shell_command=['bash'])

URL_SCHEMA = [
            (r"/terminal/a/term", TermSocket,
                    {'term_manager': term_manager})
        ]
