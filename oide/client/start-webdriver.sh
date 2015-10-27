#!/bin/bash

/usr/bin/Xvfb :99 -ac -screen 0 1024x768x24 &
export DISPLAY=:99
node_modules/protractor/bin/webdriver-manager start
