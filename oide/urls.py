from oide.lib.handlers.pam_auth import PAMLoginHandler
from oide.lib.handlers.logout import LogoutHandler
from oide.lib.handlers.main import MainHandler
from oide.lib.handlers.state import StateHandler

from oide.apps.filebrowser.handlers import LocalFileHandler
from oide.apps.filebrowser.handlers import FilesystemUtilHandler
from oide.apps.filebrowser.handlers import FilesystemUploadHandler
from oide.apps.filebrowser.handlers import FileTreeHandler
from oide.apps.webterminal.handlers import EmbedTerminalHandler
from oide.apps.vnc.handlers import VncConfigHandler
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
            (r"/vnc/a/config", VncConfigHandler),
        ]
