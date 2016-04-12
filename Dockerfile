FROM ubuntu:14.04
MAINTAINER Zeb Sampedro

# Installs
RUN apt-get update && apt-get install -y build-essential python-dev python-pip
RUN pip install oide

# Add user
RUN useradd -m oide
RUN echo "oide:oide" | chpasswd

# Setup settings overrides
RUN mkdir -p /home/oide/.config/oide
RUN touch /home/oide/.config/oide/oide_settings.py
RUN chown -R oide:oide /home/oide/.config/

ENV "OIDE_SETTINGS=/home/oide/.config/oide/oide_settings.py"
CMD ["/usr/local/bin/oide"]
