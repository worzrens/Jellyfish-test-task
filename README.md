## Simple Chat with sockets on Flask and React

Make sure that env variables are set, then run **docker-compose up --build**

**Required next env variables to run:**

```POSTGRES_USER``` - username of psql db
```POSTGRES_PASSWORD``` - password of psql db
```POSTGRES_DB``` - name of db
```SECRET``` - secret for flask app
```PSQL_LINK=postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@db:5432/{POSTGRES_DB}``` - sqlaclhemy db uri
