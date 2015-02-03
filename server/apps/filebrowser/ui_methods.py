import os
from filesystem.common import list_root_paths, get_dir_contents



def get_root_paths(username):
    for rp in list_root_paths(username):
        yield rp

