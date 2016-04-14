import oide.settings as global_settings
import os
import shutil
import importlib

if os.path.exists('../devtest'):
    shutil.rmtree("../devtest")
os.makedirs("../devtest")

spec_list = []
for app_name in global_settings.INSTALLED_APPS:
    # get the module object using the module name
    module = importlib.import_module(app_name)
    # get package name
    package_name = module.__name__
    # get the path to app static files and tests
    path = module.__path__[0]
    spec_list.append((package_name, path))

# print spec_list
for app in spec_list:
    # copy static files to the devtest directory
    shutil.copytree(app[1] + '/static', "../devtest/" + app[0] + "/static")
    if os.path.exists(app[1] + '/tests'):
        shutil.copytree(app[1] + '/tests', "../devtest/" + app[0] + "/tests")
