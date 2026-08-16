import { HttpInterceptorFn } from '@angular/common/http';

const authStorageKey = 'nsp_admin_auth';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem(authStorageKey);
  if (!token || request.headers.has('Authorization')) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
