import settings as global_settings



def get_module_list(*args,**kwargs):
    return list(global_settings.INSTALLED_MODULES)

