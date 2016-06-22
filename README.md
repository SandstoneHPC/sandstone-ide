Sandstone IDE
====

Sandstone IDE is a consolidated set of web-based, visual utilities that facilitate access to HPC resources.

This repo contains Sandstone IDE Core components: a code editor, a filebrowser, and a basic web terminal.

For the Slurm scheduler assistant app, install [sandstone-slurm-assist](https://github.com/SandstoneHPC/oide-slurm-assist)

For a combination web terminal and Jupyter BASH notebook, install [sandstone-nb-term](https://github.com/SandstoneHPC/oide-nb-term)


## Installing Sandstone IDE using PIP

To install Sandstone IDE using PIP, run:
```
pip install sandstone
```

Sandstone IDE can now be run with the following command:
```
sandstone
```
To use Sandstone IDE, point your browser to `localhost:8888`.

## Running Sandstone IDE with Docker

To run Sandstone IDE in a Docker container, run:
```
docker build -t sandstone .
docker run -p 49160:8888 -d --user=sandstone sandstone
```
To use Sandstone IDE, point your browser to `localhost:49160`. Login with username:pass `sandstone:sandstone`.

## Installing Sandstone IDE from source

To install Sandstone IDE, first clone the repository and enter the project directory:
```
git clone https://github.com/SandstoneHPC/sandstone-ide.git
cd sandstone-ide
```
Then, build the dependencies for the front-end components:
```
cd sandstone/client
npm install
```

Now configure your local Sandstone IDE Core and app settings, if they diverge from the defaults.

Switch back to the project root and install the python package (a virtualenv is recommended):
```
python setup.py install
```
Sandstone IDE can now be run with the following command:
```
sandstone
```
To use Sandstone IDE, point your browser to `localhost:8888`.

## Configuring environment settings overrides

**Port** By default, Sandstone IDE serves on :8888. To override this value, assign the desired port number to the `SANDSTONE_PORT` environment variable.

**Sandstone settings location** If you wish to override any defaults besides the port number, you must make a file called `sandstone_settings.py`, and assign the absolute path of that file to the `SANDSTONE_SETTINGS` environment variable.

## Configuring the optional sandstone_settings.py

`COOKIE_SECRET` Assign this to something secret. _default: 'YouShouldProbablyChangeThisValueForYourProject'_

`USE_SSL` Either True or False, this value determines whether or Sandstone IDE will serve over SSL. _default: False_

`SSL_CERT` The absolute filepath, as a string, of the SSL cert _default: None_

`SSL_KEY` The absolute filepath, as a string, of the SSL key _default: None_

`INSTALLED_APPS` A tuple to declare which Sandstone modules should be imported when you start the app. _default:_
```
(
    'sandstone.apps.codeeditor',
    'sandstone.apps.filebrowser',
    'sandstone.apps.webterminal',
)
```

`FILESYSTEM_ROOT_DIRECTORIES` A tuple to declare filesystem roots for the filetree and filebrowser. _default:_
```
(
    '/home/%(username)s/',
    '/tmp/',
)
```
If you wish to replace your home directory with the directory in which you run Sandstone IDE, you would assign the tuple as follows:
```
(
    'os.environ['PWD'],
    '/tmp/',
)
```
