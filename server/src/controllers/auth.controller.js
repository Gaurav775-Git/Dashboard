export const setAuthCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,         
    sameSite: 'none',     // <--- MUST BE LOWERCASE 'none'
    domain: undefined     
  };

  res.cookie('access_token', accessToken, {
    ...cookieOptions,
    path: '/',
    maxAge: 15 * 60 * 1000, 
  });

  res.cookie('refresh_token', refreshToken, {
    ...cookieOptions,
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000, 
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