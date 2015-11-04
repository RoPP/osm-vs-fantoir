from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import DOUBLE_PRECISION

from .extensions import db


class StatutFantoir(db.Model):
    __tablename__ = 'statut_fantoir'

    fantoir = Column(db.String(10), index=True, primary_key=True)
    id_statut = Column(db.Integer)
    timestamp_statut = Column(DOUBLE_PRECISION)
    insee_com = Column(db.String(5), index=True)


class LabelsStatutsFantoir(db.Model):
    __tablename__ = 'labels_statuts_fantoir'

    id_statut = Column(db.Integer, primary_key=True)
    tri = Column(db.Integer, default=0)
    label_statut = Column(db.String(200), nullable=False)

    def __init__(self, label, sort):
        self.label_statut = label
        self.tri = sort
