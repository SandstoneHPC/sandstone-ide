import os
import stat
import pwd
import shutil
import logging

import settings as global_settings



class InsufficientPermissionError(Exception):
    def __init__(self, filepath, operation):
        self.filepath = filepath
        self.operation = operation
    def __str__(self):
        return 'Operation {} failed on {}'.format(self.operation,self.filepath)
        
class MissingFileError(Exception):
    def __init__(self, filepath):
        self.filepath = filepath
    def __str__(self):
        return 'File {} does not exist.'.format(self.filepath)


def valid_root(username,filepath):
    fp = os.path.abspath(filepath) + '/'
    valid_root = False
    for patt in list_root_paths(username):
        if fp.startswith(patt):
            valid_root = True
    return valid_root

def chown_recursive(username,startpath):
    if not valid_root(username,startpath):
        raise InsufficientPermissionError(startpath,'CHANGE_PERMISSION')
    
    startpath = os.path.abspath(startpath)
    pwd_info = pwd.getpwnam(username)
    
    for root, dirs, files in os.walk(startpath):  
        for d in dirs:  
            os.lchown(os.path.join(root, d),pwd_info.pw_uid,pwd_info.pw_gid)
        for f in files:
            os.lchown(os.path.join(root, f),pwd_info.pw_uid,pwd_info.pw_gid)
    return startpath

def make_executable(username,filepath):
    if not valid_root(username,filepath):
        raise InsufficientPermissionError(startpath,'CHANGE_PERMISSION')
    
    filepath = os.path.abspath(filepath)
    st = os.stat(filepath)
    os.chmod(filepath, st.st_mode | 0111)
    
    return filepath

def list_root_paths(username, **kwargs):
    root_patterns = global_settings.FILESYSTEM_ROOT_DIRECTORIES
    formatted_patterns = []
    for patt in root_patterns:
        patt = patt.replace('{{USERNAME}}',username)
        formatted_patterns.append(patt)
    return formatted_patterns

def list_root_dirs_for_user(username):
    for patt in list_root_paths(username):
        yield { patt: [ f for f in list_dir_for_user(username,patt) ] }
        
def get_filetrees_for_user(username):
    for patt in list_root_paths(username):
        yield [ d for d in os.walk(patt) ]

def get_dir_contents(username, dirpath):
    if not valid_root(username,dirpath):
        raise InsufficientPermissionError(dirpath,'READ_DIRECTORY')
    
    try:
        for i in os.listdir(dirpath):
            filepath = os.path.join(dirpath,i)
            is_dir = os.path.isdir(filepath)
            if is_dir:
                filepath = filepath + '/'
            yield( i,filepath,is_dir )
    except OSError:
        raise MissingFileError(dirpath)
    
def file_exists(username, filepath):
    if not valid_root(username,filepath):
        logging.error('User {} has insufficient permissions to read file {}'.format(username,filepath))
        raise InsufficientPermissionError(filepath,'CHECK_EXISTS')
    
    filepath = os.path.abspath(filepath)
    exists = os.path.exists(filepath)
    return exists

def create_file(username, filepath):
    if not valid_root(username,filepath):
        logging.error('User {} has insufficient permissions to create file {}'.format(username,filepath))
        raise InsufficientPermissionError(filepath,'CREATE_FILE')
    
    filepath = os.path.abspath(filepath)
    if os.path.exists(filepath):
        logging.info('File {} already exists, not creating'.format(filepath))
        return filepath
    pwd_info = pwd.getpwnam(username)
    fd = open(filepath,'w')
    fd.close()
    os.lchown(filepath,pwd_info.pw_uid,pwd_info.pw_gid)
    logging.info('Created file at {}'.format(filepath))
    return filepath

def update_file(username, filepath, content):
    if not valid_root(username, filepath):
        logging.error('User {} has insufficient permissions to update file {} with content:\n{}'.format(username,filepath,content[:80]))
        raise InsufficientPermissionError(filepath, 'UPDATE_FILE')
    
    filepath = os.path.abspath(filepath)
    if not os.path.exists(filepath):
        logging.error('File {} does not exist, cannot update'.format(filepath))
        raise MissingFileError(filepath)
    pwd_info = pwd.getpwnam(username)

    with open(filepath, 'w') as local_file:
        for line in content:
            local_file.write(line)
            
    logging.info('Updated file at {}, with content:\n{}'.format(filepath,content[:80]))
    return filepath

def delete_file(username, filepath):
    if not valid_root(username,filepath):
        raise InsufficientPermissionError(filepath,'DELETE_FILE')
    
    filepath = os.path.abspath(filepath)
    pwd_info = pwd.getpwnam(username)
    
    if os.path.isdir(filepath):
        shutil.rmtree(filepath)
    else:
        os.remove(filepath)
    return filepath

def create_directory(username, filepath):
    if not valid_root(username,filepath):
        raise InsufficientPermissionError(filepath,'CREATE_DIRECTORY')
    
    filepath = os.path.abspath(filepath)
    pwd_info = pwd.getpwnam(username)

    os.mkdir(filepath)

    os.lchown(filepath,pwd_info.pw_uid,pwd_info.pw_gid)
    return filepath

def move_file(username, origpath, newpath):
    if not ( valid_root(username,origpath) and valid_root(username,newpath) ):
        raise InsufficientPermissionError(filepath,'MOVE_FILE')
    
    origpath = os.path.abspath(origpath)
    newpath = os.path.abspath(newpath)
    pwd_info = pwd.getpwnam(username)

    shutil.move(origpath,newpath)

    chown_recursive(username,newpath)
    return newpath
    
def copy_file(username, origpath, newpath):
    if not ( valid_root(username,origpath) and valid_root(username,newpath) ):
        raise InsufficientPermissionError(filepath,'COPY_FILE')
    
    origpath = os.path.abspath(origpath)
    newpath = os.path.abspath(newpath)
    pwd_info = pwd.getpwnam(username)
    
    if os.path.isdir(origpath):
        shutil.copytree(origpath,newpath)
    else:
        shutil.copy2(origpath,newpath)
    
    return newpath

def rename_file(username, origpath, newpath):
    if not ( valid_root(username,origpath) and valid_root(username,newpath) ):
        raise InsufficientPermissionError(filepath,'MODIFY_FILE')
    
    origpath = os.path.abspath(origpath)
    newpath = os.path.abspath(newpath)
    pwd_info = pwd.getpwnam(username)
    
    os.rename(origpath,newpath)
    
    os.lchown(newpath,pwd_info.pw_uid,pwd_info.pw_gid)
    return newpath
