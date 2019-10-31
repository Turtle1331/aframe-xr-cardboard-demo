from bottle import route, redirect, static_file, template, run
import autogen
import os
import socket
import threading
import time

site = '''
<div style='font-size: 4em;'>
<h3>Contents of {{path}}</h3>
% for file in files:
    <a href='{{file}}'>{{file}}</a><br /><br />
% end
<a href='quit'>Quit</a><br />
'''

@route('/')
def get_root():
    return redirect('/boundary/index.html')

@route('/<path:path>')
def get_path(path=None):
    path = path or '.'
    if os.path.isdir(path):
        files = filter(lambda x:not x.startswith('.'), sorted(os.listdir(path)))
        return template(site, path=path, files=files)
    else:
        return static_file(path, root='.')

def print_startup_message():
    ip = socket.gethostbyname(socket.getfqdn())
    print('HTTPS server started at https://{}:8090'.format(ip))

if __name__ == '__main__':
    process = autogen.start_server()
    if not process:
        print('\nRoot certificate not found. Please follow the setup instructions in the README.')
    else:
        time.sleep(0.1)  # Let stunnel print first
        threading.Timer(0.1, print_startup_message).start()
        try:
            run(host='127.0.0.1', port=8080)
        except KeyboardInterrupt:
            pass
        finally:
            process.terminate()
