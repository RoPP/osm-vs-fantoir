from flask import Blueprint
from flask.ext.restful import Resource, Api
from flask.ext.restful import fields, marshal_with

from ..models import LabelsStatutsFantoir
from ..extensions import db

api_bp = Blueprint('api', __name__)
api = Api(api_bp)

fantoir_status_label = {
    'id_statut': fields.Integer,
    'label_statut': fields.String,
}


class ApiFantoirStatusLabel(Resource):
    @marshal_with(fantoir_status_label)
    def get(self):
        query = db.session.query(LabelsStatutsFantoir).order_by(LabelsStatutsFantoir.sort)
        return query.all()

api.add_resource(ApiFantoirStatusLabel, '/api/fantoir/status_label')
