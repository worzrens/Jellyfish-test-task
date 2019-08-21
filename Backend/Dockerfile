FROM python:3.6-alpine3.9


WORKDIR /backend

COPY ./ ./

CMD ["apt-get install", "python-psycopg2"]

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python3.6", "app.py"]
