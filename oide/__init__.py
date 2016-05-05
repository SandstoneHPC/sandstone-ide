import app
import os
import sys
import imp

from oide import global_settings


SETTINGS_ENVVAR = 'OIDE_SETTINGS'

class SettingsLoader(object):
    def __init__(self):
        # Make sure that the INSTALLED_APPS override is loaded prior
        # any other settings or overrides.
        setattr(self,'INSTALLED_APPS',global_settings.INSTALLED_APPS)
        local_settings_file = os.environ.get(SETTINGS_ENVVAR,None)
        if local_settings_file:
            self.local_settings = imp.load_source('local_settings',local_settings_file)
            if hasattr(self.local_settings,'INSTALLED_APPS'):
                setattr(self,'INSTALLED_APPS',local_settings.INSTALLED_APPS)
        ignore = ['INSTALLED_APPS']
        # Load default settings
        self._load_settings(global_settings,ignorelist=ignore)
        # Load app settings
        for app in self.INSTALLED_APPS:
            try:
                app_settings = __import__(app,fromlist=['settings'])
                self._load_settings(app_settings,ignorelist=ignore)
            except ImportError:
                continue

    def _load_settings(self,mod,ignorelist=[]):
        for setting in dir(mod):
            if setting.isupper() and setting not in ignorelist:
                setattr(self,setting,getattr(mod,setting))


settings = SettingsLoader()

def run_server():
    app.main()
