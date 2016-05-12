FROM oide
MAINTAINER Zebula Sampedro
"INSTALLED_APPS=('oide.lib','oide.apps.filebrowser',)" \
    > /home/oide/.config/oide/oide_settings.py
RUN chown -R oide:oide /home/oide/.config/
CMD ["/usr/local/bin/oide"]
