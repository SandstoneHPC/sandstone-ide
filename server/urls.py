from lib.handlers.pam_auth import PAMLoginHandler
from lib.handlers.logout import LogoutHandler
from lib.handlers.main import MainHandler
from lib.handlers.alerts import AlertsHandler
from lib.handlers.test import TestHandler
from lib.handlers.state import StateHandler

from apps.filebrowser.handlers import LocalFileHandler
from apps.filebrowser.handlers import FilesystemUtilHandler
from apps.filebrowser.handlers import FilesystemUploadHandler
from apps.filebrowser.handlers import FileTreeHandler
from apps.webterminal.handlers import EmbedTerminalHandler
#import handlers here



URL_SCHEMA = [
            (r"/auth/login", PAMLoginHandler),
            (r"/auth/logout", LogoutHandler),
            (r"/", MainHandler),
            (r"/a/state", StateHandler),
            (r"/filebrowser/localfiles(.*)", LocalFileHandler),
            (r"/filebrowser/a/fileutil", FilesystemUtilHandler),
            (r"/filebrowser/a/upload", FilesystemUploadHandler),
            (r"/filebrowser/filetree/a/dir", FileTreeHandler),
            (r"/terminal/a/embed", EmbedTerminalHandler),
        ]
