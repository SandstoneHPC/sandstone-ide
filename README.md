OIDE
====

Online Integrated Development Environment

**Installing the OIDE**

To install the OIDE, first clone the repository and enter the project directory:
```
git clone https://github.com/ResearchComputing/OIDE.git
cd OIDE
```
Then, build the dependencies for the front-end components:
```
cd oide/client
npm install
```

Now configure your local OIDE Core and app settings, if they diverge from the defaults. OIDE Core settings can be found in `OIDE/oide/settings.py`. App-specific settings can be found at `OIDE/oide/apps/<app-name>/settings.py`. The settings files may be modified directly, or be overridden with a `local_settings.py` file in the same directory:

Switch back to the project root and install the python package (a virtualenv is recommended):
```
python setup.py install
```
The OIDE can now be run with the following command:
```
oide
```
To use the OIDE, point your browser to `localhost:8888`.
