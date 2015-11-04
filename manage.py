from flask.ext.script import Manager
from flask.ext.migrate import MigrateCommand

from bano import create_app
from bano.extensions import db
from bano.api.models import Status

manager = Manager(create_app)
manager.add_command('db', MigrateCommand)

@manager.command
def initdb():
    """Init/reset database."""

    db.drop_all()
    db.create_all()

    db.session.add_all([
        Status('Ok', 0),
        Status('Erreur d’orthographe', 1),
        Status('Divergence d’orthographe', 2),
        Status('Nom différent', 3),
        Status('Type de voie différent', 4),
        Status('Voie doublon et type de voie différent', 5),
        Status('Voie doublon avec orthographe différente', 6),
        Status('Répétition du type de voie', 8),
        Status('Nom introuvable sur le terrain', 9),
        Status('Ancien nom supprimé sur le terrain', 10),
        Status('Erreurs combinées', 99),
        Status('Adresses hors périmètre', 15),
        Status('Voie détruite', 12),
        Status('Voie incorporée à une autre', 13),
        Status('Voie inexistante', 14),
        Status('Voie doublon (même type et même nom)', 7),
        Status('Nom tronqué', 11),
    ])
    db.session.commit()


if __name__ == '__main__':
    manager.run()
