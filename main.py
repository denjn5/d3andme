"""
Set up website, point to index.html and supporting files. 

Think MVC not directory structure!
Orig path: '/LOC/Falcon/Falcon/static'
"""

import bottle as web
import os

# Simple primary file
@web.route('/simple')
def index():
    path = os.path.dirname(os.path.realpath(__file__)) + r'\app'
    print('path: ' + path)
    return web.static_file('simple.html', root=path)


# Primary file
@web.route('/')
@web.route('/<name>')
@web.view('d3andme')
def index(name='World'):
    #path = os.path.dirname(os.path.realpath(__file__)) + r'\app'
    #print('path: ' + path)
    return dict(name=name)


# Resources
@web.route('/resource/<filename>')
def index(filename):
    res_path = os.path.dirname(os.path.realpath(__file__)) + r'\resources'
    print('res_path: ' + res_path)
    return web.static_file(filename, root=res_path)

# Application files
@web.route('/app/<filename>')
def index(filename):
    app_path = os.path.dirname(os.path.realpath(__file__)) + r'\app'
    print('app_path: ' + app_path)
    return web.static_file(filename, root=app_path)

# Data
@web.route('/data/<filename>')
def index(filename):
    data_path = os.path.dirname(os.path.realpath(__file__)) + r'\data'
    print('data_path: ' + data_path)
    return web.static_file(filename, root=data_path)


#@web.view('hello_template')
#def hello(name='World'):
#    return dict(name=name)

web.run(host='localhost', port=8080, debug=True)
