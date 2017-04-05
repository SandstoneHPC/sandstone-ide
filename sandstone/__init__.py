import os
import sys
import imp
import argparse

import global_settings



SETTINGS_ENVVAR = 'SANDSTONE_SETTINGS'

class SettingsLoader(object):
    def __init__(self):
        # Make sure that the INSTALLED_APPS override is loaded prior
        # any other settings or overrides.
        setattr(self,'INSTALLED_APPS',global_settings.INSTALLED_APPS)
        local_settings_file = os.environ.get(SETTINGS_ENVVAR,None)
        local_settings = None
        if local_settings_file:
            local_settings = imp.load_source('local_settings',local_settings_file)
            if hasattr(local_settings,'INSTALLED_APPS'):
                setattr(self,'INSTALLED_APPS',local_settings.INSTALLED_APPS)
        ignore = ['INSTALLED_APPS','APP_SPECIFICATION']
        # Load default settings
        self._load_settings(global_settings,ignorelist=ignore)
        # Load app settings
        setattr(self,'APP_SPECIFICATIONS',[])
        for app in self.INSTALLED_APPS:
            try:
                app_settings = __import__(app+'.settings',fromlist=[''])
                # Set app specifications
                if hasattr(app_settings,'APP_SPECIFICATION'):
                    specs = app_settings.APP_SPECIFICATION
                    specs['PY_MODULE_NAME'] = app
                    specs['PY_MODULE_PATH'] = os.path.split(app_settings.__file__)[0]
                    self.APP_SPECIFICATIONS.append(specs)
                # Load settings
                self._load_settings(app_settings,ignorelist=ignore)
            except ImportError:
                continue
        # Load overrides
        if local_settings:
            self._load_settings(local_settings,ignorelist=ignore)

    def _load_settings(self,mod,ignorelist=[]):
        for setting in dir(mod):
            if setting.isupper() and setting not in ignorelist:
                setattr(self,setting,getattr(mod,setting))


settings = SettingsLoader()

import app
def run_server():
    parser = argparse.ArgumentParser(description='Run Sandstone IDE.')
    parser.add_argument('--port')
    parser.add_argument('--prefix')
    args = parser.parse_args()

    kwargs = {}

    if args.port: kwargs['port'] = args.port
    if args.prefix: kwargs['prefix'] = args.prefix

    app.main(**kwargs)
