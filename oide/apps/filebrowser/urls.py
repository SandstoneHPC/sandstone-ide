from oide.apps.filebrowser.handlers import LocalFileHandler
from oide.apps.filebrowser.handlers import FilesystemUtilHandler
from oide.apps.filebrowser.handlers import FilesystemUploadHandler
from oide.apps.filebrowser.handlers import FileTreeHandler



URL_SCHEMA = [
            (r"/filebrowser/localfiles(.*)", LocalFileHandler),
            (r"/filebrowser/a/fileutil", FilesystemUtilHandler),
            (r"/filebrowser/a/upload", FilesystemUploadHandler),
            (r"/filebrowser/filetree/a/dir", FileTreeHandler),
        ]
