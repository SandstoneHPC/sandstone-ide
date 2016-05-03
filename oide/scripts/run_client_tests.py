import oide.settings
import os
import json
import shutil
import importlib
import subprocess
import re



oide_mod = __import__('oide',fromlist=[''])
core_path = os.path.join(oide_mod.__path__[0],'client','oide','')
path_map = {
    'oide/': '/static/core/',
}
preprocessors = {
    'oide/components/**/*.html': 'ng-html2js',
}
file_list = [
    'oide/bower_components/angular/angular.js', 'oide/bower_components/angular-ui-router/release/angular-ui-router.js',
    'oide/bower_components/angular-mocks/angular-mocks.js',
    'oide/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'oide/bower_components/ace-builds/src-min-noconflict/ace.js',
    'oide/bower_components/angular-ui-ace/ui-ace.js',
    'oide/bower_components/angular-tree-control/angular-tree-control.js',
    'oide/bower_components/angular-smart-table/dist/smart-table.js',
    'oide/bower_components/angular-file-upload/dist/angular-file-upload.js',
    'oide/bower_components/term.js/src/term.js',
    'oide/components/**/*.js',
    'oide/components/**/*.html',
    'oide/oide.mod.js',
    'oide/oide.test.js',
]

dep_list = [
    'ui.router',
    'oide.acemodes',
    'ui.bootstrap',
]

for app_name in oide.settings.INSTALLED_APPS:
    # get the module object using the module name
    mod = __import__(app_name, fromlist=[''])
    try:
        settings = __import__(app_name+'.settings', fromlist=[''])
    except ImportError:
        continue
    mod_path = mod.__path__[0]
    ng_mod_name = settings.APP_SPECIFICATION['NG_MODULE_NAME']
    mod_static_path = os.path.join(mod_path,'static')
    mod_test_path = os.path.join(mod_path,'tests','js','**','*.js')
    mod_tpl_path = os.path.join(mod_static_path,'**/*.html')

    # Define file_list for app
    file_list.append(mod_test_path)
    file_list.append(mod_tpl_path)
    for s in settings.APP_SPECIFICATION['NG_MODULE_SCRIPTS']:
        spath = os.path.join(mod_static_path,s)
        file_list.append(spath)

    # Define dep_list for app
    dep_list.append('oide.'+ng_mod_name)

    # Define module_mapper entry for app
    path_map[mod_static_path] = os.path.join('/static','apps',ng_mod_name,'')

    # Define preprocessor entry for app
    preprocessors[mod_tpl_path] = 'ng-html2js'

# Format karma.conf.js
fmt_dict = {
    'dep_list': json.dumps(dep_list),
    'file_list': json.dumps(file_list),
    'preprocessors': json.dumps(preprocessors),
    'path_map': json.dumps(path_map),
}

test_path = os.path.join(oide_mod.__path__[0],'client')
with open(os.path.join(test_path,'karma.environment.js.tpl')) as karma_tpl_env:
    file_contents = karma_tpl_env.read()

fmt_contents = file_contents%fmt_dict
with open(os.path.join(test_path,'karma.environment.js'), 'w+') as karma_env:
    karma_env.write(fmt_contents)

# Format oide.test.js
with open(os.path.join(core_path,'oide.test.js.tpl'), 'r') as test_tpl_file:
    file_contents = test_tpl_file.read()
    fmt_contents = file_contents%fmt_dict

with open(os.path.join(core_path,'oide.test.js'), "w+") as test_file:
    test_file.write(fmt_contents)

os.chdir(test_path)
subprocess.call(['npm','run','test-single-run'])
