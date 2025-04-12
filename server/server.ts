import 'dotenv/config';
import pg from 'pg';
import express from 'express';
import { ClientError, errorMiddleware, authMiddleware } from './lib/index.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

type User = {
  userId: number;
  email: string;
  username: string;
  hashedPassword: string;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();
app.use(express.json());

app.get('/api/test', async (req, res) => {
  res.send('Hello, world!');
});

/** 
 * SIGN-UP ROUTE
 * - Validates required fields (email, username, password)
 * - Hashes password securely using Argon2
 * - Stores user in the database
 * - Returns user username and email
 */
app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      throw new ClientError(400, 'Email, username and password are required');
    }

    const hashedPassword = await argon2.hash(password);

    const sql = `
    insert into "users" ("email", "username", "hashedPassword")
    values ($1, $2, $3)
    returning "userId", "email", "username", "createdAt";
    `;

    const params = [email, username, hashedPassword];
    const result = await db.query<User>(sql, params);

    res.status(201).json({
      username: result.rows[0].username,
      email: result.rows[0].email,
    });
  } catch (err: any) {
    if (err.code === '23505') {
      if (err.constraint?.includes('users_email')) {
        return next(new ClientError(409, 'Email already exists'));
      }
      if (err.constraint?.includes('users_username')) {
        return next(new ClientError(409, 'Username already exists'));
      }
    }
    next(err);
  }
});

/**
 * SIGN-IN ROUTE
 * - Authenticates user via email or username
 * - Verifies password using Argon2
 * - Issues a JWT token for authenticated sessions
 */
app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      throw new ClientError(400, 'Email or username and password are required');
    }

    const sql = `
    select "userId", "email", "username", "hashedPassword"
    from "users"
    where "email" = $1  or "username" = $1;
    `;

    const params = [identifier];
    const result = await db.query<User>(sql, params);
    const user = result.rows[0];

    if (!user) {
      throw new ClientError(401, 'Invalid email or username');
    }

    const isValidPassword = await argon2.verify(user.hashedPassword, password);
    if (!isValidPassword) {
      throw new ClientError(401, 'Invalid password');
    }

    const payload = {
      userId: user.userId,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign(payload, hashKey);

    res.status(200).json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

// route to create a movie entry with all fields required (title, summary, imdbLink, rating)
app.post('/api/movies', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new ClientError(401, 'authentication required');

    const { title, summary, imdbLink, rating } = req.body;

    if (!title || !summary || !imdbLink || !rating) {
      throw new ClientError(400, 'All fields are required');
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      throw new ClientError(400, 'Rating must be a number between 1 and 5');
    }

    const sql = `
      insert into "movies" ("userId", "title", "summary", "imdbLink", "rating")
      values ($1, $2, $3, $4, $5)
      returning *;
    `;
    const params = [userId, title, summary, imdbLink, rating];

    const result = await db.query(sql, params);
    const movie = result.rows[0];

    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
});

// route to update a movie entry will all fields editable (title, summary, imdbLink, rating)
app.put('/api/movies/:movieId', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const movieId = Number(req.params.movieId);

    if (!userId) throw new ClientError(401, 'authentication required');
    if (!movieId) throw new ClientError(400, 'movieId must be a number');

    const { title, summary, imdbLink, rating } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (title) {
      updateFields.push('"title" = $' + (updateValues.length + 1));
      updateValues.push(title);
    }

    if (summary) {
      updateFields.push('"summary" = $' + (updateValues.length + 1));
      updateValues.push(summary);
    }

    if (imdbLink) {
      updateFields.push('"imdbLink" = $' + (updateValues.length + 1));
      updateValues.push(imdbLink);
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        throw new ClientError(400, 'rating must be between 1 and 5');
      }
      updateFields.push('"rating" = $' + (updateValues.length + 1));
      updateValues.push(rating);
    }

    if (updateFields.length === 0) {
      throw new ClientError(400, 'At least one field (title, summary, imdbLink, rating) must be provided to update');
    }

    const sql = `
      update "movies"
      set ${updateFields.join(', ')}
      where "movieId" = $${updateValues.length + 1} and "userId" = $${updateValues.length + 2}
      returning *;
    `;

    updateValues.push(movieId, userId);

    const result = await db.query(sql, updateValues);
    const updated = result.rows[0];

    if (!updated) {
      throw new ClientError(404, `Movie with ID ${movieId} not found`);
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

// route to delete a movie entry
app.delete('/api/movies/:movieId', authMiddleware, async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      const movieId = Number(req.params.movieId);

      if (!userId) {
        throw new ClientError(401, 'Authentication required');
      }

      if (!Number.isInteger(movieId) || movieId <= 0) {
        throw new ClientError(400, 'Invalid movieId');
      }

      const sql = `
        delete from "movies"
        where "movieId" = $1 and "userId" = $2
        returning *;
      `;
      const params = [movieId, userId];
      const result = await db.query(sql, params);

      if (result.rows.length === 0) {
        throw new ClientError(404, `Movie ${movieId} not found`);
      }

      res.status(200).json({ message: 'Movie entry deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
);

// route to list all movie entries
app.get('/api/movies', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ClientError(401, 'authentication required');
    }

    const sql = `
      select "movieId", "title", "summary", "imdbLink", "rating", "createdAt"
      from "movies"
      where "userId" = $1
      order by "createdAt" desc;
    `;
    
    const params = [userId];
    const result = await db.query(sql, params);
    
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});