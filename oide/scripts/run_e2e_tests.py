import os
import json
import shutil
import importlib
import subprocess
import re
from oide import settings



oide_mod = __import__('oide',fromlist=[''])
core_path = os.path.join(oide_mod.__path__[0],'client','oide','')
file_list = ['e2e-tests/**/*.spec.js',]

for spec in settings.APP_SPECIFICATIONS:
    # get the module object using the module name
    mod_path = spec['PY_MODULE_PATH']
    mod_test_path = os.path.join(mod_path,'tests','e2e','**','*.spec.js')

    # Define file_list for app
    file_list.append(mod_test_path)

# Determine base_url from settings
port = '8888'
if 'OIDEPORT' in os.environ:
    port = os.environ['OIDEPORT']
protocol = 'http'
if settings.USE_SSL:
    protocol = 'https'
base_url = '{}://localhost:{}'.format(protocol,port)

# Format protractor.environment.js
fmt_dict = {
    'base_url': base_url,
    'file_list': json.dumps(file_list),
}

test_path = os.path.join(oide_mod.__path__[0],'client')
with open(os.path.join(test_path,'protractor.environment.js.tpl')) as prot_env_tpl:
    file_contents = prot_env_tpl.read()

fmt_contents = file_contents%fmt_dict
with open(os.path.join(test_path,'protractor.environment.js'), 'w+') as prot_env:
    prot_env.write(fmt_contents)

# Run tests
os.chdir(oide_mod.__path__[0])
server = subprocess.Popen(['python','app.py'])
os.chdir(test_path)
subprocess.call(['npm','run','protractor'])
server.kill()
