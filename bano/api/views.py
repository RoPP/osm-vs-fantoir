from flask import Blueprint
from flask.ext.restful import Resource, Api
from flask.ext.restful import fields, marshal_with

from .models import Status
from ..extensions import db

api_bp = Blueprint('api', __name__)
api = Api(api_bp)

fantoir_status = {
    'id': fields.Integer,
    'label': fields.String,
}


class FantoirStatus(Resource):
    @marshal_with(fantoir_status)
    def get(self):
        query = db.session.query(Status).order_by(Status.sort)
        return query.all()

api.add_resource(FantoirStatus, '/api/fantoir/status')
