from peewee import *
from sandstone.lib.db import sandstone_db



class BaseModel(Model):
    class Meta:
        database = sandstone_db
