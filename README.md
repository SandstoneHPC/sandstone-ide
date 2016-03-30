OIDE
====

The Online Integrated Development Environment (OIDE) is a consolidated set of web-based, visual utilities that facilitate access to HPC resources.

This repo contains the OIDE Core components: a code editor, a filebrowser, and a basic web terminal.

For the Slurm scheduler assistant app, install [oide-slurm-assist](https://github.com/ResearchComputing/oide-slurm-assist)

For a combination web terminal and Jupyter BASH notebook, install [oide-nb-term](https://github.com/ResearchComputing/oide-nb-term)


## Installing the OIDE using PIP

To install the OIDE using PIP, run:
```
pip install oide
```

The OIDE can now be run with the following command:
```
oide
```
To use the OIDE, point your browser to `localhost:8888`.


## Installing the OIDE from source

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

Now configure your local OIDE Core and app settings, if they diverge from the defaults.

Switch back to the project root and install the python package (a virtualenv is recommended):
```
python setup.py install
```
The OIDE can now be run with the following command:
```
oide
```
To use the OIDE, point your browser to `localhost:8888`.

## Configuring environment settings overrides

**Port** By default, the OIDE serves on :8888. To override this value, assign the desired port number to the `OIDEPORT` environment variable.

**OIDE settings location** If you wish to override any defaults besides the port number, you must make a file called `oide_settings.py`, and assign the absolute path of that file to the `OIDE_SETTINGS` environment variable.

## Configuring the optional oide_settings.py

`COOKIE_SECRET` Assign this to something secret. _default: 'YouShouldProbablyChangeThisValueForYourProject'_

`USE_SSL` Either True or False, this value determines whether or the OIDE will serve over SSL. _default: False_

`SSL_CERT` The absolute filepath, as a string, of the SSL cert _default: None_

`SSL_KEY` The absolute filepath, as a string, of the SSL key _default: None_

`INSTALLED_APPS` A tuple to declare which OIDE modules should be imported when you start the app. _default:_
```
(
    'oide.apps.codeeditor',
    'oide.apps.filebrowser',
    'oide.apps.webterminal',
)
```

`FILESYSTEM_ROOT_DIRECTORIES` A tuple to declare filesystem roots for the filetree and filebrowser. _default:_
```
(
    '/home/%(username)s/',
    '/tmp/',
)
```
If you wish to replace your home directory with the directory in which you run the oide, you would assign the tuple as follows:
```
(
    'os.environ['PWD'],
    '/tmp/',
)
```
