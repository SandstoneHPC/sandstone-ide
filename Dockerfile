FROM ubuntu:16.04
MAINTAINER Zebula Sampedro

# Installs
RUN apt-get update && apt-get install -y build-essential \
    python-dev python-pip \
    nodejs nodejs-legacy npm
RUN npm install -g npm@2

# Add user
RUN useradd -m oide
RUN echo "oide:oide" | chpasswd

# Setup settings overrides
RUN mkdir -p /home/oide/.config/oide
RUN echo "INSTALLED_APPS=('oide.lib','oide.apps.codeeditor','oide.apps.filebrowser',)" \
    > /home/oide/.config/oide/oide_settings.py
RUN chown -R oide:oide /home/oide/.config/

# Install OIDE
RUN mkdir -p /opt/OIDE/oide
ADD oide /opt/OIDE/oide/
ADD ["DESCRIPTION.rst","MANIFEST.in","requirements.txt","setup.py", "/opt/OIDE/"]
RUN cd /opt/OIDE/oide/client && npm install
RUN cd /opt/OIDE && python /opt/OIDE/setup.py install

ENV "OIDE_SETTINGS=/home/oide/.config/oide/oide_settings.py"
CMD ["/usr/local/bin/oide"]
