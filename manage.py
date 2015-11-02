from flask.ext.script import Manager
from bano import create_app

manager = Manager(create_app)


if __name__ == '__main__':
    manager.run()
