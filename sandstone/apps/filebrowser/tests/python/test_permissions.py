import unittest
import tempfile
import os
import shutil
import mock

from sandstone.apps.filebrowser.permissions import filemode



class FilemodeTestCase(unittest.TestCase):
    def test_filemode(self):
        fmode = 0100777
        perms = filemode(fmode)
        self.assertEqual(perms,'-rwxrwxrwx')
        fmode = 040777
        perms = filemode(fmode)
        self.assertEqual(perms,'drwxrwxrwx')
        fmode = 0120777
        perms = filemode(fmode)
        self.assertEqual(perms,'lrwxrwxrwx')

        fmode = 0100751
        perms = filemode(fmode)
        self.assertEqual(perms,'-rwxr-x--x')
        fmode = 040751
        perms = filemode(fmode)
        self.assertEqual(perms,'drwxr-x--x')
        fmode = 0120751
        perms = filemode(fmode)
        self.assertEqual(perms,'lrwxr-x--x')

    def test_filemode_bad_type(self):
        fmode = '0100777'
        self.assertRaises(TypeError,filemode,fmode)
