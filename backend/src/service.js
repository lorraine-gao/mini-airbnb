// service.js
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';
import { db } from './server.js';    // Firestore 实例
import { InputError, AccessError } from './error.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

/*****************************************
              Auth Functions
*****************************************/

// Register
export async function register(email, password, name) {
  if (!email)   throw new InputError('Must provide an email for user registration');
  if (!password)throw new InputError('Must provide a password for user registration');
  if (!name)    throw new InputError('Must provide a name for user registration');

  const userRef = db.collection('users').doc(email);
  const userSnap = await userRef.get();
  if (userSnap.exists) {
    throw new InputError('Email address already registered');
  }

  await userRef.set({ name, password, sessionActive: true });
  return jwt.sign({ email }, JWT_SECRET, { algorithm: 'HS256' });
}

// Login
export async function login(email, password) {
  if (!email)    throw new InputError('Must provide an email for user login');
  if (!password) throw new InputError('Must provide a password for user login');

  const userRef = db.collection('users').doc(email);
  const userSnap = await userRef.get();
  if (!userSnap.exists || userSnap.data().password !== password) {
    throw new InputError('Invalid email or password');
  }

  // 标记 sessionActive
  await userRef.update({ sessionActive: true });
  return jwt.sign({ email }, JWT_SECRET, { algorithm: 'HS256' });
}

// Logout
export async function logout(email) {
  const userRef = db.collection('users').doc(email);
  await userRef.update({ sessionActive: false });
}

// Verify token and extract email
export function getEmailFromAuthorization(authorization) {
  try {
    const token = authorization.replace('Bearer ', '');
    const { email } = jwt.verify(token, JWT_SECRET);
    return email;
  } catch {
    throw new AccessError('Invalid Token');
  }
}

/*****************************************
            Listing Functions
*****************************************/

// 创建新房源
export async function addListing(title, owner, address, price, thumbnail, metadata) {
  if (!title)      throw new InputError('Must provide a title for new listing');
  if (!address)    throw new InputError('Must provide an address for new listing');
  if (isNaN(price))throw new InputError('Must provide a valid price for new listing');
  if (!thumbnail)  throw new InputError('Must provide a thumbnail for new listing');
  if (!metadata)   throw new InputError('Must provide metadata for new listing');

  // 检查同名房源
  const dup = await db.collection('listings')
    .where('title', '==', title).limit(1).get();
  if (!dup.empty) {
    throw new InputError('A listing with this title already exists');
  }

  const payload = {
    title,
    owner,
    address,
    price,
    thumbnail,
    metadata,
    reviews: [],
    availability: [],
    published: false,
    postedOn: null,
  };
  const docRef = await db.collection('listings').add(payload);
  return docRef.id;
}

// 获取所有房源（简化视图）
export async function getAllListings() {
  const snap = await db.collection('listings').get();
  return snap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      owner: data.owner,
      address: data.address,
      price: data.price,
      thumbnail: data.thumbnail,
      reviews: data.reviews,
    };
  });
}

// 获取房源详情
export async function getListingDetails(listingId) {
  const doc = await db.collection('listings').doc(listingId).get();
  if (!doc.exists) throw new InputError('Invalid listing ID');
  return doc.data();
}

// 权限校验
export async function assertOwnsListing(email, listingId) {
  const doc = await db.collection('listings').doc(listingId).get();
  if (!doc.exists) throw new InputError('Invalid listing ID');
  if (doc.data().owner !== email) {
    throw new AccessError('User does not own this Listing');
  }
}

export async function assertOwnsBooking(email, bookingId) {
  const bookingRef = db.collection('bookings').doc(bookingId);
  const snap = await bookingRef.get();
  if (!snap.exists) {
    throw new InputError('Invalid booking ID');
  }
  if (snap.data().owner !== email) {
    throw new AccessError('User does not own this booking');
  }
}

// 更新房源
export async function updateListing(listingId, title, address, thumbnail, price, metadata) {
  const updates = {};
  if (title)    updates.title = title;
  if (address)  updates.address = address;
  if (thumbnail)updates.thumbnail = thumbnail;
  if (price)    updates.price = price;
  if (metadata) updates.metadata = metadata;

  await db.collection('listings').doc(listingId).update(updates);
}

// 删除房源
export async function removeListing(listingId) {
  await db.collection('listings').doc(listingId).delete();
}

// 发布房源
export async function publishListing(listingId, availability) {
  if (!availability) throw new InputError('Must provide listing availability');
  await db.collection('listings').doc(listingId).update({
    availability,
    published: true,
    postedOn: new Date().toISOString(),
  });
}

// 取消发布
export async function unpublishListing(listingId) {
  await db.collection('listings').doc(listingId).update({
    availability: [],
    published: false,
    postedOn: null,
  });
}

// 留言/评分
export async function leaveListingReview(email, listingId, bookingId, review) {
  // 简化：只检查 listing 存在与否
  const listingRef = db.collection('listings').doc(listingId);
  const listingSnap = await listingRef.get();
  if (!listingSnap.exists) throw new InputError('Invalid listing ID');

  // arrayUnion 方式追加 review
  await listingRef.update({
    reviews: admin.firestore.FieldValue.arrayUnion(review),
  });
}

/*****************************************
           Booking Functions
*****************************************/

// 下单
export async function makeNewBooking(owner, dateRange, totalPrice, listingId) {
  const listingSnap = await db.collection('listings').doc(listingId).get();
  if (!listingSnap.exists)             throw new InputError('Invalid listing ID');
  if (!dateRange)                      throw new InputError('Must provide a valid date range');
  if (isNaN(totalPrice) || totalPrice<0) throw new InputError('Must provide a valid total price');
  if (listingSnap.data().owner === owner) throw new InputError('Cannot book your own listing');
  if (!listingSnap.data().published)   throw new InputError('Cannot book an unpublished listing');

  const payload = {
    owner,
    dateRange,
    totalPrice,
    listingId,
    status: 'pending'
  };
  const docRef = await db.collection('bookings').add(payload);
  return docRef.id;
}

// 获取所有订单
export async function getAllBookings() {
  const snap = await db.collection('bookings').get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 删除订单
export async function removeBooking(bookingId) {
  await db.collection('bookings').doc(bookingId).delete();
}

// 接受订单
export async function acceptBooking(owner, bookingId) {
  const bookingRef = db.collection('bookings').doc(bookingId);
  const bookingSnap = await bookingRef.get();
  if (!bookingSnap.exists) throw new InputError('Invalid booking ID');

  const { listingId, status } = bookingSnap.data();
  const listingSnap = await db.collection('listings').doc(listingId).get();
  if (!listingSnap.exists || listingSnap.data().owner !== owner) {
    throw new AccessError("Cannot accept bookings for a listing that isn't yours");
  }
  if (status === 'accepted') throw new InputError('Booking has already been accepted');
  if (status === 'declined') throw new InputError('Booking has already been declined');

  await bookingRef.update({ status: 'accepted' });
}

// 拒绝订单
export async function declineBooking(owner, bookingId) {
  const bookingRef = db.collection('bookings').doc(bookingId);
  const bookingSnap = await bookingRef.get();
  if (!bookingSnap.exists) throw new InputError('Invalid booking ID');

  const { listingId, status } = bookingSnap.data();
  const listingSnap = await db.collection('listings').doc(listingId).get();
  if (!listingSnap.exists || listingSnap.data().owner !== owner) {
    throw new AccessError("Cannot decline bookings for a listing that isn't yours");
  }
  if (status === 'declined') throw new InputError('Booking has already been declined');
  if (status === 'accepted') throw new InputError('Booking has already been accepted');

  await bookingRef.update({ status: 'declined' });
}
