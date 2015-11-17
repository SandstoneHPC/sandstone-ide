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

import oide.lib.decorators
import oide.settings as global_settings
import oide.apps.filebrowser.settings as app_settings
from oide.lib.handlers.base import BaseHandler
from oide.apps.filebrowser.mixins.fs_mixin import FSMixin



class LocalFileHandler(BaseHandler,FSMixin):

    @oide.lib.decorators.authenticated
    def get(self, path):
        abspath = os.path.abspath(path)
        try:
            content = self.fs.read_file(abspath)
            self.write({
                'content':content
            })
        except:
            self.set_status(404)
            return

    @oide.lib.decorators.authenticated
    def post(self, path):
        is_dir = self.get_argument('isDir',False) == 'true'
        try:
            if is_dir:
                file_path = self.fs.create_directory(path)
            else:
                file_path = self.fs.create_file(path)
            self.write({
                'result':file_path+', created',
                'filepath':file_path
            })
        except:
            self.set_status(404)
            return

    @oide.lib.decorators.authenticated
    def put(self, path):
        content = json.loads(self.request.body)['content']
        try:
            file_path = self.fs.update_file(path,content)
            self.write({
                'result':file_path+', updated',
                'filepath':file_path
            })
        except:
            self.set_status(404)
            return

    @oide.lib.decorators.authenticated
    def delete(self, path):
        try:
            file_path = self.fs.delete_file(path)
            self.write({
                'result':file_path+', deleted',
                'filepath':file_path
            })
        except:
            self.set_status(404)
            return

class FilesystemUtilHandler(BaseHandler,FSMixin):

    @oide.lib.decorators.authenticated
    def get(self):
        operation = self.get_argument('operation')

        if operation=='CHECK_EXISTS':
            filepath = self.get_argument('filepath')
            result = self.fs.file_exists(filepath)
            self.write({'result':result})
        if operation=='GET_NEXT_UNTITLED_FILE':
            dirpath = self.get_argument('dirpath')
            index = 0
            fileExists = True
            while fileExists:
                index+=1
                filename = 'Untitled' + str(index)
                newFilePath = os.path.join(dirpath,filename)
                fileExists = self.fs.file_exists(newFilePath)
            self.write({'result':newFilePath})
        if operation=='GET_NEXT_UNTITLED_DIR':
            dirpath = self.get_argument('dirpath')
            index = 0
            dirExists = True
            while dirExists:
                index+=1
                dirname = 'UntitledFolder' + str(index) + '/'
                newDirPath = os.path.join(dirpath,dirname)
                dirExists = self.fs.file_exists(newDirPath)
            self.write({'result':newDirPath})
        if operation=='GET_NEXT_DUPLICATE':
            filepath = self.get_argument('filepath')
            isDir = os.path.isdir(filepath)
            index = 0
            fileExists = True
            while fileExists:
                index+=1
                if isDir:
                    newFilePath = ''.join([filepath[:-1],'-duplicate%s'%index,'/'])
                else:
                    newFilePath = ''.join([filepath,'-duplicate%s'%index])
                fileExists = self.fs.file_exists(newFilePath)
            self.write({'result':newFilePath})

    @oide.lib.decorators.authenticated
    def post(self):
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
            result = self.fs.rename_file(filepath,newpath)
        elif operation=='COPY':
            origpath = self.get_argument('origpath')
            newpath = self.get_argument('newpath')
            result = self.fs.copy_file(origpath,newpath)
        elif operation=='MAKE_EXEC':
            filepath = self.get_argument('filepath')
            result = self.fs.make_executable(filepath)

        self.write({'result':result})

class FilesystemUploadHandler(BaseHandler,FSMixin):

    @oide.lib.decorators.authenticated
    def post(self):
        basepath = self.request.headers['basepath']
        mgrp = re.search(
            r'filename="(?P<filename>.*)"',
            self.request.headers['Content-Disposition']
            )
        filename = mgrp.group('filename')
        destpath = os.path.join(basepath,filename)

        session_id = self.request.headers['Session-Id']
        currpath = os.path.join(
            app_settings.NGINX_UPLOAD_DIR,
            session_id[-1],
            session_id
            )

        self.fs.move_file(currpath,destpath)
        self.write(dict(path=destpath))

class FileTreeHandler(BaseHandler,FSMixin):

    @oide.lib.decorators.authenticated
    def get(self):
        is_folders = self.get_argument('folders', '')
        if is_folders == "true":
            self.get_folders()
        else:
            dirpath = self.get_argument('dirpath','')
            dir_contents = []
            if dirpath == '':
                for r in self.fs.list_root_paths(self.current_user):
                    dir_contents.append({
                        'type':'dir',
                        'filename':r,
                        'filepath':r})
            else:
                for i in self.fs.get_dir_contents(dirpath):
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

    @oide.lib.decorators.authenticated
    def get_folders(self):
        dirpath = self.get_argument('dirpath','')
        dir_contents = []
        if dirpath == '':
            for r in self.fs.list_root_paths(self.current_user):
                dir_contents.append({
                    'type':'dir',
                    'filename':r,
                    'filepath':r})
        else:
            for i in self.fs.get_dir_folders(dirpath):
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
