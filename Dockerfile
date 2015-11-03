FROM python:3

RUN mkdir -p /srv/www
WORKDIR /srv/www

COPY requirements.txt /srv/www/
RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "manage.py", "runserver", "-h", "0.0.0.0", "-p", "80"]
