FROM sandstone
MAINTAINER Zebula Sampedro
RUN echo "INSTALLED_APPS=('sandstone.lib','sandstone.apps.codeeditor','sandstone.apps.filebrowser',)" \
    > /home/sandstone/.config/sandstone/sandstone_settings.py
RUN chown -R sandstone:sandstone /home/sandstone/.config/
CMD ["/usr/local/bin/sandstone"]
