import os
import json
import shutil
import importlib
import subprocess
import re
from oide import settings



DPORT = '49160'
BASE_URL = 'http://localhost:{}'.format(DPORT)

oide_mod = __import__('oide',fromlist=[''])
core_path = os.path.join(oide_mod.__path__[0],'client','oide','')

# Build OIDE image
os.chdir(oide_mod.__path__[0])
subprocess.call(['docker','build','-t','oide','.'])

for spec in settings.APP_SPECIFICATIONS:
    # get the module object using the module name
    mod_path = spec['PY_MODULE_PATH']
    e2e_dir = os.path.join(mod_path,'tests','e2e')
    # Check if there are E2E tests to run
    if os.path.exists(e2e_dir):
        if len(os.listdir(e2e_dir)) == 0:
            continue
        if os.listdir(e2e_dir) == ['Dockerfile']:
            continue
    else:
        continue
    mod_spec_path = os.path.join(e2e_dir,'**','*.spec.js')

    # Define file_list for app
    file_list = []
    file_list.append(mod_spec_path)

    # Format protractor.environment.js
    fmt_dict = {
        'base_url': BASE_URL,
        'file_list': json.dumps(file_list),
    }

    client_path = os.path.join(oide_mod.__path__[0],'client')
    with open(os.path.join(client_path,'protractor.environment.js.tpl')) as prot_env_tpl:
        file_contents = prot_env_tpl.read()

    fmt_contents = file_contents%fmt_dict
    with open(os.path.join(client_path,'protractor.environment.js'), 'w') as prot_env:
        prot_env.write(fmt_contents)

    # Build and run Docker container for app
    os.chdir(e2e_dir)
    subprocess.call(['docker','build','-t',spec['NG_MODULE_NAME'],'.'])
    subprocess.call([
        'docker','run','-p','49160:8888','-d','--user=oide',
        spec['NG_MODULE_NAME']
        ])

    # Run tests
    os.chdir(oide_mod.__path__[0])
    os.chdir(client_path)
    subprocess.call(['npm','run','protractor'])

    # Kill app container
    subprocess.call('docker stop $(docker ps -q)',shell=True)
