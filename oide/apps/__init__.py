import os

apps_dir = os.path.dirname(os.path.abspath(__file__))
__all__ = [ d for d in os.listdir(apps_dir) if os.path.isdir(os.path.join(apps_dir,d)) ]
