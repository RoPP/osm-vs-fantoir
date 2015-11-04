from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import DOUBLE_PRECISION, CHAR
from geoalchemy2 import Geometry

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


class FantoirVoie(db.Model):
    __tablename__ = 'fantoir_voie'

    code_dept = Column(CHAR(2), index=True)
    code_dir = Column(CHAR(1))
    code_com = Column(CHAR(3))
    code_insee = Column(CHAR(5), index=True, primary_key=True)
    id_voie = Column(CHAR(4))
    cle_rivoli = Column(CHAR(1))
    nature_voie = Column(db.String(4))
    libelle_voie = Column(db.String(26))
    type_commune = Column(CHAR(1))
    caractere_rur = Column(CHAR(1))
    caractere_voie = Column(CHAR(1))
    caractere_pop = Column(CHAR(1))
    pop_a_part = Column(db.Integer)
    pop_fictive = Column(db.Integer)
    caractere_annul = Column(CHAR(1))
    date_annul = Column(db.String(9))
    date_creation = Column(db.String(9))
    code_majic = Column(CHAR(5))
    type_voie = Column(CHAR(1))
    ld_bati = Column(CHAR(1))
    dernier_mot = Column(db.String(8))


class CumulAdresses(db.Model):
    __tablename__ = 'cumul_adresses'

    geometrie = Column(Geometry)
    numero = Column(db.String(15))
    voie_cadastre = Column(db.String(300))
    voie_osm = Column(db.String(300))
    voie_fantoir = Column(db.String(300))
    fantoir = Column(db.String(10), index=True, primary_key=True)
    insee_com = Column(CHAR(5))
    cadastre_com = Column(db.String(10))
    dept = Column(db.String(3))
    code_postal = Column(db.String(5))
    source = Column(db.String(100))
    batch_import_id = Column(db.Integer)

    __table_args__ = (
        db.Index('cumul_adresses_fantoir_source_idx', 'fantoir', 'source'),
        db.Index('cumul_adresses_geo', 'geometrie', postgresql_using='gist'),
        db.Index('cumul_adresses_insee', 'insee_com', postgresql_with={'fillfactor': 95}),
        db.Index('cumul_adresses_source', 'source', postgresql_with={'fillfactor': 95}),
    )


class CumulVoies(db.Model):
    __tablename__ = 'cumul_voies'
    geometrie = Column(Geometry)
    voie_cadastre = Column(db.String(300))
    voie_osm = Column(db.String(300))
    voie_fantoir = Column(db.String(300))
    fantoir = Column(db.String(10), index=True, primary_key=True)
    insee_com = Column(CHAR(5))
    cadastre_com = Column(db.String(10))
    dept = Column(db.String(3))
    code_postal = Column(db.String(5))
    source = Column(db.String(100))
    voie_index = Column(db.Integer)
    batch_import_id = Column(db.Integer)

    __table_args__ = (
        db.Index('cumul_voies_fantoir_source_idx', 'fantoir', 'source'),
        db.Index('cumul_voies_geo', 'geometrie', postgresql_using='gist'),
        db.Index('cumul_voies_insee', 'insee_com', postgresql_with={'fillfactor': 95}),
        db.Index('cumul_voies_source', 'source', postgresql_with={'fillfactor': 95}),
    )
