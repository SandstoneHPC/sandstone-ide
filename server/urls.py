from lib.handlers.pam_auth import PAMLoginHandler
from lib.handlers.logout import LogoutHandler
from lib.handlers.main import MainHandler
from lib.handlers.alerts import AlertsHandler
from lib.handlers.test import TestHandler

from apps.codeeditor.handlers import EditorHandler
from apps.codeeditor.handlers import EditorTabHandler
from apps.codeeditor.handlers import EditorStateHandler
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
            # (r"/a/alerts", AlertsHandler),
            # (r"/test", TestHandler),
            # (r"/codeeditor", EditorHandler),
            (r"/codeeditor/a/editortab.html", EditorTabHandler),
            (r"/codeeditor/a/editorstate", EditorStateHandler),
            (r"/filebrowser/localfiles(.*)", LocalFileHandler),
            (r"/filebrowser/a/fileutil", FilesystemUtilHandler),
            (r"/filebrowser/a/upload", FilesystemUploadHandler),
            (r"/filebrowser/filetree/a/dir", FileTreeHandler),
            # (r"/filebrowser/filetree/a/update", FileTreeUpdateHandler),
            # (r"/filebrowser/filetree/a/entry", FileTreeEntryHandler),
            # (r"/webterminal", EmbedTerminalHandler),
            # (r"/example/url", MyHandler),
        ]
