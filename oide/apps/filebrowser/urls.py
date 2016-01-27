from oide.apps.filebrowser.handlers import LocalFileHandler
from oide.apps.filebrowser.handlers import FilesystemUtilHandler
from oide.apps.filebrowser.handlers import FilesystemUploadHandler
from oide.apps.filebrowser.handlers import FileTreeHandler
from oide.apps.filebrowser.handlers import SimpleUploadHandler



URL_SCHEMA = [
            (r"/filebrowser/localfiles(.*)", LocalFileHandler),
            (r"/filebrowser/a/fileutil", FilesystemUtilHandler),
            (r"/supl/a/upload", SimpleUploadHandler),
            (r"/filebrowser/filetree/a/dir", FileTreeHandler),
        ]
