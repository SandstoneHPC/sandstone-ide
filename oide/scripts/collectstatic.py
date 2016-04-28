import oide.settings as global_settings
import os
import shutil
import importlib
import re

# clean up devtest
if os.path.exists('../devtest'):
    shutil.rmtree("../devtest")
os.makedirs("../devtest")

spec_list = []
for app_name in global_settings.INSTALLED_APPS:
    # get the module object using the module name
    module = importlib.import_module(app_name)
    settings = importlib.import_module(app_name + '.settings')
    # get package name
    package_name = module.__name__
    # get the path to app static files and tests
    path = module.__path__[0]
    # get all scripts and stylesheets
    pac_name = settings.APP_SPECIFICATION['NG_MODULE_NAME']
    scripts = []
    styles = []
    # append paths
    for script in settings.APP_SPECIFICATION['NG_MODULE_SCRIPTS']:
        scripts.append("apps/" + pac_name  + "/static/" + script)
    for style in settings.APP_SPECIFICATION['NG_MODULE_STYLESHEETS']:
        styles.append("apps/" + pac_name + "/static/" + style)
    spec_list.append((pac_name, path, 'oide.' + settings.APP_SPECIFICATION['NG_MODULE_NAME'], styles, scripts))

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

# # copy karma.conf.js
# shutil.copy('../client/karma.conf.js', '../devtest')
with open('../client/karma.conf.js') as karma_file:
    file_contents = karma_file.read()
    files = ['bower_components/angular/angular.js', 'bower_components/angular-ui-router/release/angular-ui-router.js','bower_components/angular-mocks/angular-mocks.js','bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js','bower_components/ace-builds/src-min-noconflict/ace.js','bower_components/angular-ui-ace/ui-ace.js','bower_components/angular-tree-control/angular-tree-control.js','bower_components/angular-smart-table/dist/smart-table.js','bower_components/angular-file-upload/dist/angular-file-upload.js','bower_components/term.js/src/term.js','components/**/*.js','oide.mod.js', 'oide.test.js']
    for app in spec_list:
        files.extend(app[3])
        files.extend(app[4])
    files.append('apps/**/tests/js/*.js')
    files.append('apps/**/templates/*.html')
    files.append('components/filetreedirective/templates/filetree.html')
    # print files
    file_contents = file_contents%{'file_list': str(files)}
    with open('../devtest/karma.conf.js', 'w+') as karma_dev_file:
        karma_dev_file.write(file_contents)


# copy oide.mode.js
shutil.copy('../client/oide/oide.mod.js', '../devtest')

deps = ['ui.router','oide.acemodes','ui.bootstrap']
# print spec_list
for app in spec_list:
    deps.append(app[2])
# print deps

file_contents = ''
with open("../client/oide/oide.test.js") as bootstrap_file:
    file_contents = bootstrap_file.read()
if file_contents != '':
    # file_contents = re.sub(r'var\ depList\ =\ (.*);', file_contents, "var depList = " + str(deps) + ";")
    fmt_file_contents = file_contents%{'dep_list': str(deps)}
    # print fmt_file_contents
    with open("../devtest/oide.test.js", "w+") as test_file:
        test_file.write(fmt_file_contents)
