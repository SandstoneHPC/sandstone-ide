import oide.settings as global_settings
from oide.lib.app_loader import get_installed_app_specs



def get_app_descriptions(*args,**kwargs):
    desc_list = []
    for app_spec in get_installed_app_specs():
        desc_list.append(app_spec['APP_DESCRIPTION'])
    return desc_list

def get_ng_module_spec(*args,**kwargs):
    mod_list = []
    for app_spec in get_installed_app_specs():
        mod_list.append({
            'module_name':app_spec['NG_MODULE_NAME'],
            'stylesheets':app_spec['NG_MODULE_STYLESHEETS'],
            'scripts':app_spec['NG_MODULE_SCRIPTS']
        })
    return mod_list
