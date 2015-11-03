CREATE TABLE statut_fantoir (
    fantoir character varying(10),
    id_statut integer,
    timestamp_statut double precision,
    insee_com character(5));

CREATE INDEX idx_statut_fantoir_insee ON statut_fantoir(insee_com);
CREATE INDEX idx_statut_fantoir_fantoir ON statut_fantoir(fantoir);
