from flask.ext.script import Manager
from flask.ext.migrate import MigrateCommand

from bano import create_app
from bano.extensions import db
from bano.models import LabelsStatutsFantoir

manager = Manager(create_app)
manager.add_command('db', MigrateCommand)


@manager.command
def initdb():
    """Init/reset database."""

    db.session.add_all([
        LabelsStatutsFantoir('Ok', 0),
        LabelsStatutsFantoir('Erreur d’orthographe', 1),
        LabelsStatutsFantoir('Divergence d’orthographe', 2),
        LabelsStatutsFantoir('Nom différent', 3),
        LabelsStatutsFantoir('Type de voie différent', 4),
        LabelsStatutsFantoir('Voie doublon et type de voie différent', 5),
        LabelsStatutsFantoir('Voie doublon avec orthographe différente', 6),
        LabelsStatutsFantoir('Répétition du type de voie', 8),
        LabelsStatutsFantoir('Nom introuvable sur le terrain', 9),
        LabelsStatutsFantoir('Ancien nom supprimé sur le terrain', 10),
        LabelsStatutsFantoir('Erreurs combinées', 99),
        LabelsStatutsFantoir('Adresses hors périmètre', 15),
        LabelsStatutsFantoir('Voie détruite', 12),
        LabelsStatutsFantoir('Voie incorporée à une autre', 13),
        LabelsStatutsFantoir('Voie inexistante', 14),
        LabelsStatutsFantoir('Voie doublon (même type et même nom)', 7),
        LabelsStatutsFantoir('Nom tronqué', 11),
    ])
    db.session.commit()


if __name__ == '__main__':
    manager.run()
