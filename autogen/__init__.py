import subprocess
import socket
import os

dirpath = os.path.realpath(__file__)
dirpath = os.path.dirname(dirpath)

def start_server():
    conf_template = '''
    cert = {path}/server.crt
    key  = {path}/server.key
    debug = info
    foreground=yes

    [https]
    accept  = {hostname}:8090
    connect = 127.0.0.1:8080

    [wss]
    accept  = {hostname}:8091
    connect = 127.0.0.1:8080'''

    gen_command = 'openssl req -newkey rsa:2048 -nodes -keyout server.key -subj "/C=US/ST=CA/O=root/CN={hostname}" -out server.csr && openssl x509 -req -in server.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out server.crt -days 500 -sha256'

    path = '.'
    hostname = socket.gethostbyname(socket.getfqdn())

    conf_template = conf_template.format(path=path, hostname=hostname)
    with open(os.path.join(dirpath, 'server.conf'), 'w') as f:
        f.write(conf_template)

    gen_command = gen_command.format(hostname=hostname)
    try:
        gen_process = subprocess.run(gen_command, shell=True, cwd=dirpath)
        if gen_process.returncode != 0:
            return

        return subprocess.Popen(['stunnel', 'server.conf'], cwd=dirpath)
    except KeyboardInterrupt:
        pass

if __name__ == '__main__':
    process = start_server()
    try:
        process.wait()
    except KeyboardInterrupt:
        pass
    finally:
        process.terminate()
