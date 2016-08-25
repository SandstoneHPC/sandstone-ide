import os
from peewee import *
from playhouse.sqlite_ext import SqliteExtDatabase
from sandstone import settings



db_path = os.path.expandvars(settings.DATABASE)
db_path = os.path.abspath(db_path)
db_dir = os.path.dirname(db_path)

if not os.path.exists(db_dir):
    os.makedirs(db_dir)

sandstone_db = SqliteExtDatabase(db_path)
