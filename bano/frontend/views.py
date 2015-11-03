from flask import (Blueprint, render_template, current_app)

frontend = Blueprint('frontend', __name__)


@frontend.route('/')
def index():
    current_app.logger.debug('debug')

    return render_template('index.html')


@frontend.route('/fantoir/false/')
def fantoir_false():
    current_app.logger.debug('debug')

    return render_template('fantoir_errone.html')


@frontend.route('/fantoir/list/')
def fantoir_list():
    current_app.logger.debug('debug')

    return render_template('liste_brute_fantoir.html')


@frontend.route('/fantoir/missing/')
def fantoir_missing():
    current_app.logger.debug('debug')

    return render_template('voies_recentes_manquantes.html')


@frontend.route('/fantoir/stat/')
def fantoir_stat():
    current_app.logger.debug('debug')

    return render_template('stats_dept.html')
