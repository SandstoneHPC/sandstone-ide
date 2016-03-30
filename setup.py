# -*- coding: utf-8 -*-
from distutils.core import setup
from setuptools import find_packages

setup(
    name='oide',
    version='0.11.4',
    author=u'Zebula Sampedro',
    author_email='sampedro@colorado.edu',
    packages=find_packages(),
    include_package_data=True,
    url='https://github.com/ResearchComputing/OIDE',
    license='MIT, see LICENSE',
    description="Online Integrated Development Environment (OIDE)",
    long_description=open('DESCRIPTION.rst').read(),
    zip_safe=False,
    install_requires=[
        'simplepam',
        'tornado>=4',
        'terminado',
    ],
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'Natural Language :: English',
        'Operating System :: Unix',
        'Topic :: Software Development :: User Interfaces',
        'Topic :: Software Development :: Build Tools',
        'Topic :: Text Editors :: Integrated Development Environments (IDE)',
        'Topic :: Terminals :: Terminal Emulators/X Terminals',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: JavaScript',
    ],
    entry_points={
        'console_scripts': [
            'oide=oide:run_server',
        ],
    },
)
