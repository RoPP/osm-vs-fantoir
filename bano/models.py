from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import DOUBLE_PRECISION

from .extensions import db





class LabelsStatutsFantoir(db.Model):
    __tablename__ = 'labels_statuts_fantoir'

    id_statut = Column(db.Integer, primary_key=True)
    tri = Column(db.Integer, default=0)
    label_statut = Column(db.String(200), nullable=False)

    def __init__(self, label, sort):
        self.label = label
        self.sort = sort
