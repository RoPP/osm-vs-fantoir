"""empty message

Revision ID: 5325e1d432a
Revises: 3cff0e8e69c
Create Date: 2015-11-04 22:25:57.396511

"""

# revision identifiers, used by Alembic.
revision = '5325e1d432a'
down_revision = '3cff0e8e69c'

from alembic import op
import sqlalchemy as sa
import geoalchemy2


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('cumul_adresses',
    sa.Column('geometrie', geoalchemy2.types.Geometry(), nullable=True),
    sa.Column('numero', sa.String(length=15), nullable=True),
    sa.Column('voie_cadastre', sa.String(length=300), nullable=True),
    sa.Column('voie_osm', sa.String(length=300), nullable=True),
    sa.Column('voie_fantoir', sa.String(length=300), nullable=True),
    sa.Column('fantoir', sa.String(length=10), nullable=False),
    sa.Column('insee_com', sa.CHAR(length=5), nullable=True),
    sa.Column('cadastre_com', sa.String(length=10), nullable=True),
    sa.Column('dept', sa.String(length=3), nullable=True),
    sa.Column('code_postal', sa.String(length=5), nullable=True),
    sa.Column('source', sa.String(length=100), nullable=True),
    sa.Column('batch_import_id', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('fantoir')
    )
    op.create_index('cumul_adresses_fantoir_source_idx', 'cumul_adresses', ['fantoir', 'source'], unique=False)
    op.create_index('cumul_adresses_geo', 'cumul_adresses', ['geometrie'], unique=False, postgresql_using='gist')
    op.create_index('cumul_adresses_insee', 'cumul_adresses', ['insee_com'], unique=False, postgresql_with={'fillfactor': 95})
    op.create_index('cumul_adresses_source', 'cumul_adresses', ['source'], unique=False, postgresql_with={'fillfactor': 95})
    op.create_index(op.f('ix_cumul_adresses_fantoir'), 'cumul_adresses', ['fantoir'], unique=False)
    op.create_table('cumul_voies',
    sa.Column('geometrie', geoalchemy2.types.Geometry(), nullable=True),
    sa.Column('voie_cadastre', sa.String(length=300), nullable=True),
    sa.Column('voie_osm', sa.String(length=300), nullable=True),
    sa.Column('voie_fantoir', sa.String(length=300), nullable=True),
    sa.Column('fantoir', sa.String(length=10), nullable=False),
    sa.Column('insee_com', sa.CHAR(length=5), nullable=True),
    sa.Column('cadastre_com', sa.String(length=10), nullable=True),
    sa.Column('dept', sa.String(length=3), nullable=True),
    sa.Column('code_postal', sa.String(length=5), nullable=True),
    sa.Column('source', sa.String(length=100), nullable=True),
    sa.Column('voie_index', sa.Integer(), nullable=True),
    sa.Column('batch_import_id', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('fantoir')
    )
    op.create_index('cumul_voies_fantoir_source_idx', 'cumul_voies', ['fantoir', 'source'], unique=False)
    op.create_index('cumul_voies_geo', 'cumul_voies', ['geometrie'], unique=False, postgresql_using='gist')
    op.create_index('cumul_voies_insee', 'cumul_voies', ['insee_com'], unique=False, postgresql_with={'fillfactor': 95})
    op.create_index('cumul_voies_source', 'cumul_voies', ['source'], unique=False, postgresql_with={'fillfactor': 95})
    op.create_index(op.f('ix_cumul_voies_fantoir'), 'cumul_voies', ['fantoir'], unique=False)
    op.create_table('fantoir_voie',
    sa.Column('code_dept', sa.CHAR(length=2), nullable=True),
    sa.Column('code_dir', sa.CHAR(length=1), nullable=True),
    sa.Column('code_com', sa.CHAR(length=3), nullable=True),
    sa.Column('code_insee', sa.CHAR(length=5), nullable=False),
    sa.Column('id_voie', sa.CHAR(length=4), nullable=True),
    sa.Column('cle_rivoli', sa.CHAR(length=1), nullable=True),
    sa.Column('nature_voie', sa.String(length=4), nullable=True),
    sa.Column('libelle_voie', sa.String(length=26), nullable=True),
    sa.Column('type_commune', sa.CHAR(length=1), nullable=True),
    sa.Column('caractere_rur', sa.CHAR(length=1), nullable=True),
    sa.Column('caractere_voie', sa.CHAR(length=1), nullable=True),
    sa.Column('caractere_pop', sa.CHAR(length=1), nullable=True),
    sa.Column('pop_a_part', sa.Integer(), nullable=True),
    sa.Column('pop_fictive', sa.Integer(), nullable=True),
    sa.Column('caractere_annul', sa.CHAR(length=1), nullable=True),
    sa.Column('date_annul', sa.String(length=9), nullable=True),
    sa.Column('date_creation', sa.String(length=9), nullable=True),
    sa.Column('code_majic', sa.CHAR(length=5), nullable=True),
    sa.Column('type_voie', sa.CHAR(length=1), nullable=True),
    sa.Column('ld_bati', sa.CHAR(length=1), nullable=True),
    sa.Column('dernier_mot', sa.String(length=8), nullable=True),
    sa.PrimaryKeyConstraint('code_insee')
    )
    op.create_index(op.f('ix_fantoir_voie_code_dept'), 'fantoir_voie', ['code_dept'], unique=False)
    op.create_index(op.f('ix_fantoir_voie_code_insee'), 'fantoir_voie', ['code_insee'], unique=False)
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_fantoir_voie_code_insee'), table_name='fantoir_voie')
    op.drop_index(op.f('ix_fantoir_voie_code_dept'), table_name='fantoir_voie')
    op.drop_table('fantoir_voie')
    op.drop_index(op.f('ix_cumul_voies_fantoir'), table_name='cumul_voies')
    op.drop_index('cumul_voies_source', table_name='cumul_voies')
    op.drop_index('cumul_voies_insee', table_name='cumul_voies')
    op.drop_index('cumul_voies_geo', table_name='cumul_voies')
    op.drop_index('cumul_voies_fantoir_source_idx', table_name='cumul_voies')
    op.drop_table('cumul_voies')
    op.drop_index(op.f('ix_cumul_adresses_fantoir'), table_name='cumul_adresses')
    op.drop_index('cumul_adresses_source', table_name='cumul_adresses')
    op.drop_index('cumul_adresses_insee', table_name='cumul_adresses')
    op.drop_index('cumul_adresses_geo', table_name='cumul_adresses')
    op.drop_index('cumul_adresses_fantoir_source_idx', table_name='cumul_adresses')
    op.drop_table('cumul_adresses')
    ### end Alembic commands ###
