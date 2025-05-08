import fs from 'fs';
import express from 'express';
import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json' assert { type: 'json' };
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import { InputError, AccessError } from './error.js';

import path from 'path';
import { fileURLToPath } from 'url';

import {
  getEmailFromAuthorization,
  login,
  logout,
  register,
  assertOwnsListing,
  assertOwnsBooking,
  addListing,
  getAllListings,
  getListingDetails,
  updateListing,
  removeListing,
  publishListing,
  unpublishListing,
  leaveListingReview,
  makeNewBooking,
  getAllBookings,
  removeBooking,
  acceptBooking,
  declineBooking
} from './service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.join(__dirname, '../swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
export const db = admin.firestore();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(morgan(':method :url :status'));

const catchErrors = (fn) => async (req, res) => {
  try {
    console.log(`Authorization header is ${req.header('Authorization')}`);
    if (req.method === 'GET') {
      console.log(`Query params are ${JSON.stringify(req.params)}`);
    } else {
      console.log(`Body params are ${JSON.stringify(req.body)}`);
    }
    await fn(req, res);
  } catch (err) {
    if (err instanceof InputError) {
      res.status(400).send({ error: err.message });
    } else if (err instanceof AccessError) {
      res.status(403).send({ error: err.message });
    } else {
      console.error(err);
      res.status(500).send({ error: 'A system error occurred' });
    }
  }
};

const authed = (fn) => async (req, res) => {
  const email = getEmailFromAuthorization(req.header('Authorization'));
  await fn(req, res, email);
};

// Auth routes
app.post(
  '/user/auth/register',
  catchErrors(async (req, res) => {
    const { email, password, name } = req.body;
    const token = await register(email, password, name);
    return res.json({ token });
  })
);

app.post(
  '/user/auth/login',
  catchErrors(async (req, res) => {
    const { email, password } = req.body;
    const token = await login(email, password);
    return res.json({ token });
  })
);

app.post(
  '/user/auth/logout',
  catchErrors(authed(async (req, res, email) => {
    await logout(email);
    return res.json({});
  }))
);

// Listing routes
app.get(
  '/listings',
  catchErrors(async (req, res) => {
    return res.json({ listings: await getAllListings() });
  })
);

app.get(
  '/listings/:listingid',
  catchErrors(async (req, res) => {
    const { listingid } = req.params;
    return res.json({ listing: await getListingDetails(listingid) });
  })
);

app.post(
  '/listings/new',
  catchErrors(authed(async (req, res, email) => {
    const { title, address, price, thumbnail, metadata } = req.body;
    const listingId = await addListing(title, email, address, price, thumbnail, metadata);
    return res.json({ listingId });
  }))
);

app.put(
  '/listings/:listingid',
  catchErrors(authed(async (req, res, email) => {
    const { listingid } = req.params;
    const { title, address, thumbnail, price, metadata } = req.body;
    await assertOwnsListing(email, listingid);
    await updateListing(listingid, title, address, thumbnail, price, metadata);
    return res.send({});
  }))
);

app.delete(
  '/listings/:listingid',
  catchErrors(authed(async (req, res, email) => {
    const { listingid } = req.params;
    await assertOwnsListing(email, listingid);
    await removeListing(listingid);
    return res.send({});
  }))
);

app.put(
  '/listings/publish/:listingid',
  catchErrors(authed(async (req, res, email) => {
    const { listingid } = req.params;
    const { availability } = req.body;
    await assertOwnsListing(email, listingid);
    await publishListing(listingid, availability);
    return res.send({});
  }))
);

app.put(
  '/listings/unpublish/:listingid',
  catchErrors(authed(async (req, res, email) => {
    const { listingid } = req.params;
    await assertOwnsListing(email, listingid);
    await unpublishListing(listingid);
    return res.send({});
  }))
);

app.put(
  '/listings/:listingid/review/:bookingid',
  catchErrors(authed(async (req, res, email) => {
    const { listingid, bookingid } = req.params;
    const { review } = req.body;
    await leaveListingReview(email, listingid, bookingid, review);
    return res.send({});
  }))
);

// Booking routes
app.get(
  '/bookings',
  catchErrors(authed(async (req, res) => {
    return res.json({ bookings: await getAllBookings() });
  }))
);

app.post(
  '/bookings/new/:listingid',
  catchErrors(authed(async (req, res, email) => {
    const { listingid } = req.params;
    const { dateRange, totalPrice } = req.body;
    const bookingId = await makeNewBooking(email, dateRange, totalPrice, listingid);
    return res.json({ bookingId });
  }))
);

app.delete(
  '/bookings/:bookingid',
  catchErrors(authed(async (req, res, email) => {
    const { bookingid } = req.params;
    await assertOwnsBooking(email, bookingid);
    await removeBooking(bookingid);
    return res.send({});
  }))
);

app.put(
  '/bookings/accept/:bookingid',
  catchErrors(authed(async (req, res, email) => {
    const { bookingid } = req.params;
    await acceptBooking(email, bookingid);
    return res.json({});
  }))
);

app.put(
  '/bookings/decline/:bookingid',
  catchErrors(authed(async (req, res, email) => {
    const { bookingid } = req.params;
    await declineBooking(email, bookingid);
    return res.json({});
  }))
);

// Swagger docs and basic routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req, res) => res.redirect('/docs'));
app.get('/ping', (req, res) => res.send('Server is alive'));

const port = process.env.PORT || 5033;
const server = app.listen(port, () => {
  console.log(`Backend is now listening on port ${port}!`);
  console.log(`For API docs, navigate to http://localhost:${port}`);
});

export default server;
