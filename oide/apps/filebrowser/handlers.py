import os
import re
import uuid
import json
import logging
import operator
import tornado.web
import tornado.ioloop
import tempfile

from tornado.concurrent import Future
from tornado import gen

import oide.lib.decorators
import oide.settings as global_settings
import oide.apps.filebrowser.settings as app_settings
from oide.lib.handlers.base import BaseHandler
from oide.apps.filebrowser.mixins.fs_mixin import FSMixin
from os import stat
from stat import *
from pwd import getpwuid
from permissions import *
import grp


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
        if operation == "GET_GROUPS":
            res = self.fs.get_groups()
            self.write(json.dumps(res))
        if operation == "GET_ROOT_DIR":
            list_of_root_dirs = self.fs.list_root_paths(self.current_user)
            dirpath = self.get_argument('filepath')
            root_dir = ""
            for root in list_of_root_dirs:
                if dirpath.startswith(root):
                    root_dir = root
                    break
            self.write({'result': root_dir})
        if operation == 'GET_VOLUME_INFO':
            filepath = self.get_argument('filepath')
            res = self.fs.get_volume_info(filepath)
            self.write(json.dumps({'result': res}))

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
        elif operation=='CHANGE_PERMISSIONS':
            result = self.change_permissions()
        elif operation == 'CHANGE_GROUP':
            filepath = self.get_argument('filepath')
            group = self.get_argument('group')
            self.fs.change_group(filepath, group)
            result = "Changed Group"
        self.write({'result':result})

    @oide.lib.decorators.authenticated
    def change_permissions(self):
        perm_string = self.get_argument('permissions')
        filepath = self.get_argument('filepath')
        self.fs.change_permisions(filepath, perm_string)
        result = "Changed permission of ", filepath, " to ", perm_string
        return result

@tornado.web.stream_request_body
class SimpleUploadHandler(BaseHandler, FSMixin):

    @tornado.web.authenticated
    def post(self):
        fp = self.request.headers['Uploaddir']
        dest_path = os.path.join(fp,self.filename)
        self.fd.close()
        # shutil.move(self.fd.name,dest_path)
        self.fs.move_file(self.fd.name, dest_path)
        os.chmod(dest_path, 0644)

    @tornado.web.authenticated
    def prepare(self):
        self.tmp_cache = ''
        self.stream_started = False
        self.request.connection.set_max_body_size(2*1024**3)
        fd_info = tempfile.mkstemp()
        self.fd = open(fd_info[1],'w')

    def data_received(self, data):
        self.tmp_cache += data
        pdata = self._process(data)
        self.fd.write(pdata)

    def _process(self, data):
        trimmed = data.splitlines()
        tmp = data.splitlines(True)

        if not self.stream_started:
            self.boundary = trimmed[0].strip()
            tmp = tmp[1:]
            trimmed = trimmed[1:]
            self.stream_started = True

            try:
                first_elem = trimmed[:5].index("")
                metadata = trimmed[:first_elem]
                self.filename = metadata[0].split(';')[-1].split('=')[-1][1:-1]
                tmp = tmp[first_elem + 1:]
                trimmed = trimmed[first_elem + 1:]
            except ValueError:
                pass

        try:
            last_elem = trimmed.index(self.boundary + "--")
            self.stream_started = False
            return "".join(tmp[:last_elem - 1])
        except ValueError:
            return "".join(tmp)

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
                    # Get owner information
                    stat_object = stat(i[1])
                    owner = getpwuid(stat_object.st_uid).pw_name
                    file_size = str((float(stat_object.st_size) / 1024)) + " KiB"
                    curr_file['filename'] = i[0]
                    curr_file['filepath'] = i[1]
                    curr_file['owner'] = owner
                    curr_file['size'] = file_size
                    curr_file['perm'] = filemode(stat_object[ST_MODE])
                    curr_file['perm_string'] = oct(stat_object[ST_MODE])[-3:]
                    curr_file['group'] = grp.getgrgid(stat_object.st_gid).gr_name
                    curr_file['is_accessible'] = os.access(i[1], os.W_OK)
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
                # Get owner information
                stat_object = stat(i[1])
                # owner = getpwuid(stat_object.st_uid).pw_name
                file_size = str((float(stat_object.st_size) / 1024)) + " KiB"
                curr_file['filename'] = i[0]
                curr_file['filepath'] = i[1]
                # curr_file['owner'] = owner
                curr_file['size'] = file_size
                curr_file['perm'] = filemode(stat_object[ST_MODE])
                curr_file['perm_string'] = oct(stat_object[ST_MODE])[-3:]
                curr_file['group'] = grp.getgrgid(stat_object.st_gid).gr_name
                curr_file['is_accessible'] = os.access(i[1], os.W_OK)
                dir_contents.append(curr_file)

        self.write(json.dumps(dir_contents))
