FROM oide
MAINTAINER Zebula Sampedro
RUN echo "INSTALLED_APPS=('oide.lib','oide.apps.codeeditor','oide.apps.filebrowser',)" \
    > /home/oide/.config/oide/oide_settings.py
RUN chown -R oide:oide /home/oide/.config/
CMD ["/usr/local/bin/oide"]
