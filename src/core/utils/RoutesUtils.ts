import { history } from 'core/utils';

export const isBaseRoute = () => history.location.pathname === '/';

export const isAuthRoute = () => {
  if (/^\/auth(?=\/|$)/i.test(history.location.pathname)) {
    return true;
  }
  return false;
};

export const isAdminRoute = () => {
  if (/^\/admin(?=\/|$)/i.test(history.location.pathname)) {
    return true;
  }
  return false;
};

export const isClientRoute = () => {
  if (/^\/client(?=\/|$)/i.test(history.location.pathname)) {
    return true;
  }
  return false;
};

export const isPublicRoute = () => {
  if (/^\/public(?=\/|$)/i.test(history.location.pathname)) {
    return true;
  }
  return false;
};