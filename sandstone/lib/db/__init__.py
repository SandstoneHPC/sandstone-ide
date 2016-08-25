import os
from peewee import *
from playhouse.sqlite_ext import SqliteExtDatabase
from sandstone import settings



if not os.path.exists(settings.DATABASE):
    db_dir = os.path.dirname(settings.DATABASE)
    os.path.makedirs(db_dir)

sandstone_db = SqliteExtDatabase(settings.DATABASE)
