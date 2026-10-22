export const setAuthCookies = (res, accessToken, refreshToken) => {
  // Bulletproof settings for cross-domain deployment (Vercel -> Render)
  const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

  const cookieOptions = {
    httpOnly: true,
    secure: isProd, // Must be true for SameSite=None
    sameSite: isProd ? 'none' : 'lax', // STRICT lowercase 'none'
    path: '/',
  };

  res.cookie('access_token', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie('refresh_token', refreshToken, {
    ...cookieOptions,
    path: '/api/auth', // Only send to refresh route
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearAuthCookies = (res) => {
  const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  };

  res.clearCookie('access_token', cookieOptions);
  res.clearCookie('refresh_token', { ...cookieOptions, path: '/api/auth' });

  