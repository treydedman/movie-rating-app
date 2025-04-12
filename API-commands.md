## API testing with httpie

List of commands for each route using HTTPie

## users table

## Sign-up

**command:**

```bash
http POST :8080/api/auth/sign-up email='test@example.com' username='testuser' password='password'
```

**output:**

HTTP/1.1 201 Created
Connection: keep-alive
Content-Length: 50
Content-Type: application/json; charset=utf-8
Date: Sat, 12 Apr 2025 21:37:18 GMT
ETag: W/"32-h5xctj0AhUUtrgi7dkGRa93P8aI"
Keep-Alive: timeout=5
X-Powered-By: Express

{
    "email": "test@example.com",
    "username": "testuser"
}

---

## Sign-in

**command:**

```bash
http POST :8080/api/auth/sign-in identifier='testuser' password='password'
```

**output:**

HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 266
Content-Type: application/json; charset=utf-8
Date: Sat, 12 Apr 2025 22:09:22 GMT
ETag: W/"10a-AcLOhNCsJJmmQOC8rrviFjpXaPU"
Keep-Alive: timeout=5
X-Powered-By: Express

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NDQ0OTU3NjJ9.q477t2LdpZdpXNKgvPoFMUgg3rm3tw3hxgyd4iMkABg",
    "user": {
        "email": "test@example.com",
        "userId": 1,
        "username": "testuser"
    }
}

---

## movies table

## Create a movie entry

**command:**

```bash
http POST :8080/api/movies \
  "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NDQ0OTU3NjJ9.q477t2LdpZdpXNKgvPoFMUgg3rm3tw3hxgyd4iMkABg" \
  title="Gladiator" \
  summary="A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery." \
  imdbLink="https://www.imdb.com/title/tt0172495/" \
  rating:=5
```

**output:**

HTTP/1.1 201 Created
Connection: keep-alive
Content-Length: 287
Content-Type: application/json; charset=utf-8
Date: Sat, 12 Apr 2025 22:30:55 GMT
ETag: W/"11f-UDTW9zrySnVP8f/1IrLcG1TopYM"
Keep-Alive: timeout=5
X-Powered-By: Express

{
    "createdAt": "2025-04-12T22:30:55.673Z",
    "imdbLink": "https://www.imdb.com/title/tt0172495/",
    "movieId": 1,
    "rating": 5,
    "summary": "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    "title": "Gladiator",
    "userId": 1
}

---

## Edit a movie entry

**command:**

```bash
http PUT :8080/api/movies/1 \
  "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NDQ0OTU3NjJ9.q477t2LdpZdpXNKgvPoFMUgg3rm3tw3hxgyd4iMkABg" \
  rating:=4
```

  **output:**

HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 287
Content-Type: application/json; charset=utf-8
Date: Sat, 12 Apr 2025 22:43:39 GMT
ETag: W/"11f-2jOqp0qW98FDd5p/hyqQ7ZHOk+A"
Keep-Alive: timeout=5
X-Powered-By: Express

{
    "createdAt": "2025-04-12T22:30:55.673Z",
    "imdbLink": "https://www.imdb.com/title/tt0172495/",
    "movieId": 1,
    "rating": 4,
    "summary": "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    "title": "Gladiator",
    "userId": 1
}

---

## Delete a movie entry

**command:**

```bash
http DELETE :8080/api/movies/3 "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NDQ0OTU3NjJ9.q477t2LdpZdpXNKgvPoFMUgg3rm3tw3hxgyd4iMkABg"
```

**output:**

HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 46
Content-Type: application/json; charset=utf-8
Date: Sat, 12 Apr 2025 23:21:16 GMT
ETag: W/"2e-q98og5Qz8pZsrJE1r1JB8QP0IcY"
Keep-Alive: timeout=5
X-Powered-By: Express

{
    "message": "Movie entry deleted successfully"
}

---

## Create a few more movie entries

**command:**

```bash
http POST :8080/api/movies \
  "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NDQ0OTU3NjJ9.q477t2LdpZdpXNKgvPoFMUgg3rm3tw3hxgyd4iMkABg" \
  title="Ghostbusters" \
  summary="Three former parapsychology professors set up shop as a unique ghost removal service in New York City." \
  imdbLink="https://www.imdb.com/title/tt0087332/" \
  rating:=4
```
**output:**

HTTP/1.1 201 Created
Connection: keep-alive
Content-Length: 263
Content-Type: application/json; charset=utf-8
Date: Sat, 12 Apr 2025 23:33:39 GMT
ETag: W/"107-1BGxkPkBYYTPhX4rljc07s7VaAs"
Keep-Alive: timeout=5
X-Powered-By: Express

{
    "createdAt": "2025-04-12T23:33:39.520Z",
    "imdbLink": "https://www.imdb.com/title/tt0087332/",
    "movieId": 4,
    "rating": 4,
    "summary": "Three former parapsychology professors set up shop as a unique ghost removal service in New York City.",
    "title": "Ghostbusters",
    "userId": 1
}


**command:**

```bash
http POST :8080/api/movies \
  "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NDQ0OTU3NjJ9.q477t2LdpZdpXNKgvPoFMUgg3rm3tw3hxgyd4iMkABg" \
  title="Tommy Boy" \
  summary="After his father dies, the overweight, underachieving Tommy teams up with a snide accountant to save the family business." \
  imdbLink="https://www.imdb.com/title/tt0114694/" \
  rating:=4
```

**output:**

HTTP/1.1 201 Created
Connection: keep-alive
Content-Length: 279
Content-Type: application/json; charset=utf-8
Date: Sat, 12 Apr 2025 23:36:28 GMT
ETag: W/"117-wsKsu8K40ol8bPz0EJe9g7zJ1k4"
Keep-Alive: timeout=5
X-Powered-By: Express

{
    "createdAt": "2025-04-12T23:36:28.012Z",
    "imdbLink": "https://www.imdb.com/title/tt0114694/",
    "movieId": 5,
    "rating": 4,
    "summary": "After his father dies, the overweight, underachieving Tommy teams up with a snide accountant to save the family business.",
    "title": "Tommy Boy",
    "userId": 1
}

**command:**

```bash
http POST :8080/api/movies \
  "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NDQ0OTU3NjJ9.q477t2LdpZdpXNKgvPoFMUgg3rm3tw3hxgyd4iMkABg" \
  title="Uncle Buck" \
  summary="A lazy, good-natured bachelor is tasked with babysitting his brother's rebellious teenage daughter and her younger siblings." \
  imdbLink="https://www.imdb.com/title/tt0098554/" \
  rating:=4
```

**output:**

HTTP/1.1 201 Created
Connection: keep-alive
Content-Length: 283
Content-Type: application/json; charset=utf-8
Date: Sat, 12 Apr 2025 23:37:48 GMT
ETag: W/"11b-cnUm0rR74QSkeEk/PE55Ay4yVcc"
Keep-Alive: timeout=5
X-Powered-By: Express

{
    "createdAt": "2025-04-12T23:37:48.569Z",
    "imdbLink": "https://www.imdb.com/title/tt0098554/",
    "movieId": 6,
    "rating": 4,
    "summary": "A lazy, good-natured bachelor is tasked with babysitting his brother's rebellious teenage daughter and her younger siblings.",
    "title": "Uncle Buck",
    "userId": 1
}

---

## List all movie entries

**command:**

```bash
http :8080/api/movies "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NDQ0OTU3NjJ9.q477t2LdpZdpXNKgvPoFMUgg3rm3tw3hxgyd4iMkABg"
```

**output:**

HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 1073
Content-Type: application/json; charset=utf-8
Date: Sat, 12 Apr 2025 23:41:07 GMT
ETag: W/"431-BAaBzW0Xvnt85SQiU8NnCG+yMjU"
Keep-Alive: timeout=5
X-Powered-By: Express

[
    {
        "createdAt": "2025-04-12T23:37:48.569Z",
        "imdbLink": "https://www.imdb.com/title/tt0098554/",
        "movieId": 6,
        "rating": 4,
        "summary": "A lazy, good-natured bachelor is tasked with babysitting his brother's rebellious teenage daughter and her younger siblings.",
        "title": "Uncle Buck"
    },

    {
        "createdAt": "2025-04-12T23:36:28.012Z",
        "imdbLink": "https://www.imdb.com/title/tt0114694/",
        "movieId": 5,
        "rating": 4,
        "summary": "After his father dies, the overweight, underachieving Tommy teams up with a snide accountant to save the family business.",
        "title": "Tommy Boy"
    },

    {
        "createdAt": "2025-04-12T23:33:39.520Z",
        "imdbLink": "https://www.imdb.com/title/tt0087332/",
        "movieId": 4,
        "rating": 4,
        "summary": "Three former parapsychology professors set up shop as a unique ghost removal service in New York City.",
        "title": "Ghostbusters"
    },

    {
        "createdAt": "2025-04-12T22:30:55.673Z",
        "imdbLink": "https://www.imdb.com/title/tt0172495/",
        "movieId": 1,
        "rating": 4,
        "summary": "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
        "title": "Gladiator"
    }]
