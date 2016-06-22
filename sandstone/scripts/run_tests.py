import subprocess
import sys



sys.stdout.write("""Running server tests:
---------------------------------------------------------------\n\n""")
subprocess.call(['python','run_server_tests.py'])

sys.stdout.write("""Running client tests:
---------------------------------------------------------------\n\n""")
subprocess.call(['python','run_client_tests.py'])
