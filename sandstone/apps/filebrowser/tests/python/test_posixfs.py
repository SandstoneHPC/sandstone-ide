import unittest
import tempfile
import os
import shutil
import mock
from stat import *
import pwd

from sandstone.apps.filebrowser.posixfs import PosixFS


ROOTS = (
    '/tmp/$USER/test/',
    '$HOME/dev/',
    '/tmp/',
)
TEST_ENV = {
    'USER':'testuser',
    'HOME':'/home/testuser'
}

class PosixFSTestCase(unittest.TestCase):
    def setUp(self):
        self.test_dir = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.test_dir)

    @mock.patch('sandstone.settings.FILESYSTEM_ROOT_DIRECTORIES',ROOTS)
    @mock.patch('os.environ',TEST_ENV)
    def test_list_root_paths(self):
        ps_roots = PosixFS.list_root_paths()
        self.assertEqual(
            ps_roots,
            [
                '/tmp/testuser/test/',
                '/home/testuser/dev/',
                '/tmp/',
            ]
        )
        # env vars undefined
        with mock.patch('os.environ',{}):
            ps_roots = PosixFS.list_root_paths()
            self.assertEqual(ps_roots,list(ROOTS))

    def test_create_directory(self):
        abs_fp = os.path.join(self.test_dir,'testDirA')
        rel_fp = os.path.join(self.test_dir,'..',self.test_dir,'testDirR')
        nest_fp = os.path.join(self.test_dir,'nested/testDir')

        for fp in [abs_fp,rel_fp,nest_fp]:
            tfp = PosixFS.create_directory(fp)
            self.assertEqual(tfp,os.path.abspath(fp))
            self.assertTrue(os.path.exists(fp))

    def test_create_file(self):
        abs_fp = os.path.join(self.test_dir,'test.txt')
        rel_fp = os.path.join(self.test_dir,'..',self.test_dir,'test2.txt')
        ex_fp = os.path.join(self.test_dir,'text3.txt')

        fp = PosixFS.create_file(abs_fp)
        self.assertEqual(fp,abs_fp)
        self.assertTrue(os.path.exists(abs_fp))

        fp = PosixFS.create_file(rel_fp)
        self.assertEqual(fp,os.path.abspath(rel_fp))
        self.assertTrue(os.path.exists(rel_fp))

        open(ex_fp,'w').close()
        fp = PosixFS.create_file(ex_fp)
        self.assertEqual(fp,ex_fp)
        self.assertTrue(os.path.exists(ex_fp))

    def test_file_exists(self):
        abs_dp = os.path.join(self.test_dir,'testDir')
        rel_fp = os.path.join(self.test_dir,'..',self.test_dir,'testfile.txt')
        fake_fp = '/does/not/exist'

        os.mkdir(abs_dp)
        open(rel_fp,'w').close()

        self.assertTrue(PosixFS.file_exists(abs_dp))
        self.assertTrue(PosixFS.file_exists(rel_fp))
        self.assertFalse(PosixFS.file_exists(fake_fp))

    def test_read_file(self):
        fp = os.path.join(self.test_dir,'testfile.txt')
        cnt_str = 'test\n\nstring\n'
        with open(fp,'w') as f:
            f.write(cnt_str.encode('utf8'))

        content = PosixFS.read_file(fp)
        self.assertEqual(
            content,
            cnt_str
        )

        self.assertRaises(IOError,PosixFS.read_file,'/does/not/exist')

    def test_update_file(self):
        fp1 = os.path.join(self.test_dir,'testfile1.txt')
        fp2 = os.path.join(self.test_dir,'testfile2.txt')
        fp_dne = os.path.join(self.test_dir,'dne.txt')
        cnt_str = 'test\n\nstring\n'
        for fp in [fp1,fp2]:
            with open(fp,'w') as f:
                f.write(cnt_str.encode('utf8'))

        # Test does not exist
        self.assertRaises(IOError,PosixFS.update_file,fp_dne,'')

        # Test string
        tfp = PosixFS.update_file(fp1,'test\n\nstring\n\u00E1\n\u00E1\u00E1')
        with open(fp1, 'r') as f:
            content = f.read()
            self.assertEqual(
                content,
                'test\n\nstring\n\u00E1\n\u00E1\u00E1'
            )
        # Test list
        tfp = PosixFS.update_file(fp2,['\u00E1\n','\u00E1\u00E1'])
        with open(fp2, 'r') as f:
            content = f.read()
            self.assertEqual(
                content,
                '\u00E1\n\u00E1\u00E1'
            )

    def test_delete_file(self):
        abs_dp = os.path.join(self.test_dir,'testDir')
        os.mkdir(abs_dp)
        open(os.path.join(abs_dp,'testfile.txt'),'w').close()
        rel_fp = os.path.join(self.test_dir,'..',self.test_dir,'testfile.txt')
        open(rel_fp,'w').close()

        self.assertRaises(OSError,PosixFS.delete_file,'/fake/fp')

        fp = PosixFS.delete_file(abs_dp)
        self.assertEqual(fp,abs_dp)
        self.assertFalse(os.path.exists(abs_dp))

        fp = PosixFS.delete_file(rel_fp)
        self.assertEqual(fp,rel_fp)
        self.assertFalse(os.path.exists(rel_fp))

    def test_move_file(self):
        abs_dp = os.path.join(self.test_dir,'testDir')
        os.mkdir(abs_dp)
        open(os.path.join(abs_dp,'testfile.txt'),'w').close()
        rel_fp = os.path.join(self.test_dir,'..',self.test_dir,'testfile.txt')
        open(rel_fp,'w').close()
        new_dp = os.path.join(self.test_dir,'newDir')
        new_fp = os.path.join(self.test_dir,'newFile.txt')

        self.assertRaises(IOError,PosixFS.move_file,'/fake/fp',new_dp)
        self.assertRaises(OSError,PosixFS.move_file,abs_dp,'/fake/fp')

        fp = PosixFS.move_file(abs_dp,new_dp)
        self.assertEqual(fp,new_dp)
        self.assertTrue(os.path.exists(new_dp))
        self.assertTrue(os.path.exists(os.path.join(new_dp,'testfile.txt')))
        self.assertFalse(os.path.exists(abs_dp))

        fp = PosixFS.move_file(rel_fp,new_fp)
        self.assertEqual(fp,new_fp)
        self.assertTrue(os.path.exists(new_fp))
        self.assertFalse(os.path.exists(rel_fp))

    def test_copy_file(self):
        abs_dp = os.path.join(self.test_dir,'testDir')
        os.mkdir(abs_dp)
        open(os.path.join(abs_dp,'testfile.txt'),'w').close()
        rel_fp = os.path.join(self.test_dir,'..',self.test_dir,'testfile.txt')
        open(rel_fp,'w').close()
        new_dp = os.path.join(self.test_dir,'newDir')
        new_fp = os.path.join(self.test_dir,'newFile.txt')

        self.assertRaises(IOError,PosixFS.copy_file,'/fake/fp',new_dp)
        self.assertRaises(OSError,PosixFS.copy_file,abs_dp,'/fake/fp')

        fp = PosixFS.copy_file(abs_dp,new_dp)
        self.assertEqual(fp,new_dp)
        self.assertTrue(os.path.exists(new_dp))
        self.assertTrue(os.path.exists(os.path.join(new_dp,'testfile.txt')))
        self.assertTrue(os.path.exists(abs_dp))

        fp = PosixFS.copy_file(rel_fp,new_fp)
        self.assertEqual(fp,new_fp)
        self.assertTrue(os.path.exists(new_fp))
        self.assertTrue(os.path.exists(rel_fp))

    def test_rename_file(self):
        abs_dp = os.path.join(self.test_dir,'testDir')
        os.mkdir(abs_dp)
        open(os.path.join(abs_dp,'testfile.txt'),'w').close()
        rel_fp = os.path.join(self.test_dir,'..',self.test_dir,'testfile.txt')
        open(rel_fp,'w').close()
        new_dp = os.path.join(self.test_dir,'newDir')
        new_fp = os.path.join(self.test_dir,'newFile.txt')

        self.assertRaises(OSError,PosixFS.rename_file,'/fake/fp',new_dp)

        fp = PosixFS.rename_file(abs_dp,new_dp)
        self.assertEqual(fp,new_dp)
        self.assertTrue(os.path.exists(new_dp))
        self.assertTrue(os.path.exists(os.path.join(new_dp,'testfile.txt')))
        self.assertFalse(os.path.exists(abs_dp))

        fp = PosixFS.rename_file(rel_fp,new_fp)
        self.assertEqual(fp,new_fp)
        self.assertTrue(os.path.exists(new_fp))
        self.assertFalse(os.path.exists(rel_fp))

    def test_get_dir_contents(self):
        dp = os.path.join(self.test_dir,'testDir')
        os.mkdir(dp)
        sub_fp = os.path.join(dp,'testfile.txt')
        open(sub_fp,'w').close()
        fp = os.path.join(self.test_dir,'testfile.txt')
        open(fp,'w').close()

        contents = PosixFS.get_dir_contents(self.test_dir)

        user = pwd.getpwuid(os.getuid())[0]
        exp_contents = [
            {
                'size': '4.0K',
                'perm': 'drwxrwxr-x',
                'perm_string': '775',
                'owner': user,
                'group': user,
                'filepath': dp,
                'filename': 'testDir'
            },
            {
                'size': '0 bytes',
                'perm': '-rw-rw-r--',
                'perm_string': '664',
                'owner': user,
                'group': user,
                'filepath': fp,
                'filename': 'testfile.txt'
            }
        ]
        self.assertListEqual(contents,exp_contents)

    def test_get_dir_folders(self):
        dp = os.path.join(self.test_dir,'testDir')
        os.mkdir(dp)
        sub_fp = os.path.join(dp,'testfile.txt')
        open(sub_fp,'w').close()
        fp = os.path.join(self.test_dir,'testfile.txt')
        open(fp,'w').close()

        contents = PosixFS.get_dir_folders(self.test_dir)
        exp_contents = [
            (
                'testDir',
                dp+'/',
                True
            )
        ]
        self.assertEqual(contents,exp_contents)

    def test_change_permissions(self):
        dp = os.path.join(self.test_dir,'testDir')
        os.mkdir(dp)
        sub_fp = os.path.join(dp,'testfile.txt')
        open(sub_fp,'w').close()
        fp = os.path.join(self.test_dir,'testfile.txt')
        open(fp,'w').close()

        PosixFS.change_permisions(dp,'777')
        self.assertEqual(os.stat(dp)[ST_MODE],040777)

        PosixFS.change_permisions(fp,'777')
        self.assertEqual(os.stat(fp)[ST_MODE],0100777)

    def test_get_groups(self):
        groups = PosixFS.get_groups()
        self.assertEqual(type(groups),type([]))

    def test_get_size_empty_directory(self):
        self.assertEqual(PosixFS.get_size(self.test_dir), '4.0K')

    def test_get_size_files(self):
        tempfile_1 = os.path.join(self.test_dir, 'temp_1')
        tempfile_2 = os.path.join(self.test_dir, 'temp_2')

        with open(tempfile_1, 'w') as tmp_file:
            tmp_file.write('Some Text')

        with open(tempfile_2, 'w') as tmp_file:
            tmp_file.write('Some More Text')

        self.assertEqual(PosixFS.get_size(self.test_dir), '12K')

    def test_get_permissions_directory(self):
        perm_string_1 = 'drwxrwxr-x'
        self.assertEqual(PosixFS.get_permissions(perm_string_1), '775')

        perm_string_2 = '-rw-rw-r--'
        self.assertEqual(PosixFS.get_permissions(perm_string_2), '664')
