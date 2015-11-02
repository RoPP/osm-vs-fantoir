from flask import (Blueprint, render_template, current_app)

frontend = Blueprint('frontend', __name__)


@frontend.route('/')
def index():
    current_app.logger.debug('debug')

    return render_template('index.html')
