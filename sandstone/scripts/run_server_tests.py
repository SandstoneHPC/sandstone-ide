import unittest
import os
from sandstone import settings
import sys




sandstone_suite = unittest.TestSuite()
for app in settings.INSTALLED_APPS:
    mod = __import__(app,fromlist=[''])
    app_dir = os.path.dirname(os.path.abspath(mod.__file__))
    test_dir = os.path.join(app_dir,'tests/python')
    try:
        app_suite = unittest.TestLoader().discover(test_dir)
        sandstone_suite.addTests(app_suite)
    except ImportError:
        print 'No tests found for {}'.format(app)

runner = unittest.TextTestRunner()
# runner.run(sandstone_suite)
ret = not runner.run(sandstone_suite).wasSuccessful()
sys.exit(ret)
