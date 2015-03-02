import os
import re
import uuid
import json
import logging
import operator
import tornado.web
import tornado.ioloop

from tornado.concurrent import Future
from tornado import gen

import settings as global_settings
from lib.handlers.base import BaseHandler
from apps.filebrowser.filesystem import common



class LocalFileHandler(BaseHandler, tornado.web.StaticFileHandler):

    def initialize(self):
        pass

    @tornado.web.authenticated
    def get(self, path, include_body=True):
        username = self.get_current_user()
        root_paths = common.list_root_paths(username)
        self.path = self.parse_url_path(path)
        self.root = None

        for p in root_paths:
            if self.path.startswith(p):
                self.root = p

        if self.root:
            super(LocalFileHandler, self).get(path)
        else:
            self.set_status(404)
            return

    @tornado.web.authenticated
    def post(self, path):
        username = self.get_current_user()
        is_dir = self.get_argument('isDir',False) == 'true'
        try:
            if is_dir:
                file_path = common.create_directory(username,path)
                logging.info('Created directory {} for user {}'.format(path,username))
            else:
                file_path = common.create_file(username,path)
                logging.info('Created file {} for user {}'.format(path,username))
            self.write(file_path+', created')
        except:
            logging.error('Error creating file at {} for user {}'.format(path,username))
            raise tornado.web.HTTPError(404, "Insufficient permission for specified path")

    @tornado.web.authenticated
    def put(self, path):
        username = self.get_current_user()
        content = self.get_argument('content')
        try:
            file_path = common.update_file(username,path,content)
            logging.info('Updated file {} for user {}, adding the following content:\n{}...'.format(path,username,content[:80]))
            self.write(file_path+', updated')
        except:
            logging.error('Failed to update file {} for user {}, adding the following content:\n{}...'.format(path,username,content[:80]))
            raise tornado.web.HTTPError(404, "Insufficient permission for specified path")

    @tornado.web.authenticated
    def delete(self, path):
        username = self.get_current_user()
        try:
            file_path = common.delete_file(username,path)
            self.write(file_path+', deleted')
        except:
            raise tornado.web.HTTPError(404, "Insufficient permission for specified path")

class FilesystemUtilHandler(BaseHandler):

    @tornado.web.authenticated
    def get(self):
        username = self.get_current_user()
        operation = self.get_argument('operation')

        if operation=='CHECK_EXISTS':
            filepath = self.get_argument('filepath')
            result = common.file_exists(username,filepath)
            self.write({'result':result})
        if operation=='GET_NEXT_UNTITLED_FILE':
            dirpath = self.get_argument('dirpath')
            index = 0
            fileExists = True
            while fileExists:
                index+=1
                filename = 'Untitled' + str(index)
                newFilePath = os.path.join(dirpath,filename)
                fileExists = common.file_exists(username,newFilePath)
            self.write({'result':newFilePath})
        if operation=='GET_NEXT_UNTITLED_DIR':
            dirpath = self.get_argument('dirpath')
            index = 0
            dirExists = True
            while dirExists:
                index+=1
                dirname = 'UntitledFolder' + str(index) + '/'
                newDirPath = os.path.join(dirpath,dirname)
                dirExists = common.file_exists(username,newDirPath)
            self.write({'result':newDirPath})

    @tornado.web.authenticated
    def post(self):
        username = self.get_current_user()
        operation = self.get_argument('operation')

        if operation=='RENAME':
            filepath = self.get_argument('filepath')
            new_name = self.get_argument('newFileName')
            if os.path.isdir(filepath):
                basepath = os.path.split(os.path.dirname(filepath))[0]
                newpath = os.path.join(basepath,new_name)+'/'
            else:
                basepath = os.path.dirname(filepath)
                newpath = os.path.join(basepath,new_name)
            result = common.rename_file(username,filepath,newpath)
        elif operation=='COPY':
            origpath = self.get_argument('origpath')
            newpath = self.get_argument('newpath')
            result = common.copy_file(username,origpath,newpath)
        elif operation=='MAKE_EXEC':
            filepath = self.get_argument('filepath')
            result = common.make_executable(username,filepath)

        self.write({'result':result})

class FilesystemUploadHandler(BaseHandler):

    @tornado.web.authenticated
    def post(self):
        username = self.get_current_user()

        basepath = self.request.headers['basepath']
        mgrp = re.search(
            r'filename="(?P<filename>.*)"',
            self.request.headers['Content-Disposition']
            )
        filename = mgrp.group('filename')
        destpath = os.path.join(basepath,filename)

        session_id = self.request.headers['Session-Id']
        currpath = os.path.join(
            global_settings.NGINX_UPLOAD_DIR,
            session_id[-1],
            session_id
            )

        common.move_file(username,currpath,destpath)
        self.write(dict(path=destpath))

class FileTreeHandler(BaseHandler):

    @tornado.web.authenticated
    def get(self):
        dirpath = self.get_argument('dirpath','')
        dir_contents = []
        if dirpath == '':
            for r in common.list_root_paths(self.current_user):
                dir_contents.append({
                    'type':'dir',
                    'filename':r,
                    'filepath':r})
        else:
            for i in common.get_dir_contents(self.current_user, dirpath):
                curr_file = {}
                if i[0].startswith('.'):
                    continue
                if i[2]:
                    curr_file['type'] = 'dir'
                else:
                    curr_file['type'] = 'file'
                curr_file['filename'] = i[0]
                curr_file['filepath'] = i[1]
                dir_contents.append(curr_file)

        self.write(json.dumps(dir_contents))
