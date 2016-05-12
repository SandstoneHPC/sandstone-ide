FROM oide
MAINTAINER Zebula Sampedro
RUN echo "INSTALLED_APPS=('oide.lib','oide.apps.codeeditor',)" \
    > /home/oide/.config/oide/oide_settings.py
RUN chown -R oide:oide /home/oide/.config/
CMD ["/usr/local/bin/oide"]
