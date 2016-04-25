import unittest
import os
import oide.settings



oide_suite = unittest.TestSuite()
for app in oide.settings.INSTALLED_APPS:
    mod = __import__(app,fromlist=[''])
    app_dir = os.path.dirname(os.path.abspath(mod.__file__))
    test_dir = os.path.join(app_dir,'tests/python')
    try:
        app_suite = unittest.TestLoader().discover(test_dir)
        oide_suite.addTests(app_suite)
    except ImportError:
        print 'No tests found for {}'.format(app)

runner = unittest.TextTestRunner()
runner.run(oide_suite)
