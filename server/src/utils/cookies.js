export const setAuthCookies = (res, accessToken, refreshToken) => {
  // Hardcoded for Render/Vercel cross-domain deployment
  const cookieOptions = {
    httpOnly: true,
    secure: true,         // MUST be true for Render (HTTPS)
    sameSite: 'none',     // MUST be lowercase 'none' for cross-domain
    domain: undefined     // Let the browser figure out the domain
  };

  res.cookie('access_token', accessToken, {
    ...cookieOptions,
    path: '/',
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie('refresh_token', refreshToken, {
    ...cookieOptions,
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearAuthCookies = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: undefined
  };

  res.clearCookie('access_token', { ...cookieOptions, path: '/' });
  res.clearCookie('refresh_token', { ...cookieOptions, path: '/api/auth' });
};