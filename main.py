"""
Set up website, point to index.html and supporting files. 

Think MVC not directory structure!
Orig path: '/LOC/Falcon/Falcon/static'
"""

import bottle as web
import os

# Primary file
@web.route('/')
def index():
    path = os.path.dirname(os.path.realpath(__file__)) + '\static'
    return web.static_file('index.html', root=path)


# Supporting files
@web.route('/static/<filename>')
def index(filename):
    path = os.path.dirname(os.path.realpath(__file__)) + '\static'
    return web.static_file(filename, root=path)

#@web.view('hello_template')
#def hello(name='World'):
#    return dict(name=name)

web.run(host='localhost', port=8080, debug=True)
