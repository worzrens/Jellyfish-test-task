FROM python:3.6-alpine3.9

WORKDIR /backend

COPY ./ ./

RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev

RUN pip install -r requirements.txt

CMD ["python3.6", "app.py"]
