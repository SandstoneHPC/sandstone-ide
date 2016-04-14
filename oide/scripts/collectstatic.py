import oide.settings as global_settings
import os
import shutil
import importlib

# clean up devtest
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
    shutil.copytree(app[1] + '/static', "../devtest/apps/" + app[0] + "/static")
    if os.path.exists(app[1] + '/tests'):
        shutil.copytree(app[1] + '/tests', "../devtest/apps/" + app[0] + "/tests")

# copy node_modules and bower_components
shutil.copytree('../client/node_modules', '../devtest/node_modules')
shutil.copytree('../client/oide/bower_components', '../devtest/bower_components')

# copy core components
shutil.copytree('../client/oide/components', '../devtest/components')

# copy karma.conf.js
shutil.copy('../client/karma.conf.js', '../devtest')
