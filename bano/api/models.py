from sqlalchemy import Column

from ..extensions import db


class Status(db.Model):

    __tablename__ = 'labels_status_fantoir'

    id = Column('id_statut', db.Integer, primary_key=True)
    sort = Column('tri', db.Integer, default=0)
    label = Column('label_statut', db.String, nullable=False)

    def __init__(self, label, sort):
        self.label = label
        self.sort = sort
