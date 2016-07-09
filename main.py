"""
main file that sets website 

TODO: root directory relies on a /LOC/ directory under C:.  Make this relative?
"""


import bottle as web

# Primary file
@web.route('/')
def index():
    return web.static_file('index.html', root='/LOC/Falcon/Falcon/static')


# Primary file
@web.route('/<filename>')
def index(filename):
    return web.static_file(filename, root='/LOC/Falcon/Falcon')

# Think MVC not directory structure!
@web.route('/static/<filename>')
def index(filename):
    return web.static_file(filename, root='/LOC/Falcon/Falcon/static')

#@web.route('/hello')
#@web.route('/hello/<name>')
#@web.view('hello_template')
#def hello(name='World'):
#    return dict(name=name)


web.run(host='localhost', port=8080, debug=True)


