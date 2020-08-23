import cookie from 'cookie';

// one day in seconds
export const ONE_DAY = 24 * 60 * 60;

/**
 * Stores a cookie which will expire after maxAge seconds. If no maxAge is defined
 * the cookie will persist for the duration of the browser session.
 * @param {string} name
 * @param {string} value
 * @param {number} maxAge - time until expiry in seconds
 */
export const createCookie = (name, value, maxAge) => {
  const cookies = cookie.serialize(name, value, {
    path: '/',
    maxAge,
  });

  document.cookie = cookies;
};

/**
 * Returns the value of the cookie keyed by the supplied name
 * @param {string} name
 * @returns {string}
 */
export const readCookie = (name) => {
  const cookies = cookie.parse(document.cookie);
  return cookies[name];
};

/**
 * Deletes a cookie with the supplied name by setting the value to ''
 * and the maxAge to zero
 * @param {string} name
 */
export const eraseCookie = (name) => {
  createCookie(name, '', 0);
};
