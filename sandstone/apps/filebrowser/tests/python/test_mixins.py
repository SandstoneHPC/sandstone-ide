import unittest
import mock
from sandstone.lib.test_utils import TestHandlerBase

from sandstone.apps.filebrowser.posixfs import PosixFS
from sandstone.apps.filebrowser.mixins.fs_mixin import FSMixin



class FSMixinTestCase(TestHandlerBase):
    def test_initialize(self):
        request = mock.Mock()
        handler = FSMixin(self.get_app(),request)
        self.assertTrue(issubclass(handler.fs,PosixFS))
