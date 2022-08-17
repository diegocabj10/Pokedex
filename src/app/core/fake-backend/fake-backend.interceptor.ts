import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    role: 'Admin',
  },
  {
    id: 2,
    username: 'user',
    password: 'user',
    firstName: 'Normal',
    lastName: 'User',
    role: 'User',
  },
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const { username, password } = body;
      const user = users.find(
        (x) => x.username === username && x.password === password
      );
      if (!user) return error('Username or password is incorrect');
      return ok({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: `fake-jwt-token.${user.id}`,
      });
    }

    function getUsers() {
      if (!isAdmin()) return unauthorized();
      return ok(users);
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized();

      // only admins can access other user records
      if (!isAdmin() && currentUser()!.id !== idFromUrl())
        return unauthorized();

      const user = users.find((x) => x.id === idFromUrl());
      return ok(user);
    }

    // helper functions

    function ok(body: any) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function unauthorized() {
      return throwError(() => new Error('unauthorized'));
    }

    function error(message: string) {
      return throwError(() => new Error(message));
    }

    function isLoggedIn() {
      const authHeader = headers.get('Authorization') || '';
      return authHeader.startsWith('Bearer fake-jwt-token');
    }

    function isAdmin() {
      return isLoggedIn() && currentUser()!.role === 'Admin';
    }

    function currentUser() {
      if (!isLoggedIn()) return;
      const AuthorizationHeader = 'Authorization';
      const id = parseInt(headers.get(AuthorizationHeader)!.split('.')[1]);
      return ensure(users.find((x) => x.id === id));
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }

    function ensure<T>(
      argument: T | undefined | null,
      message: string = 'This value was promised to be there.'
    ): T {
      if (argument === undefined || argument === null) {
        throw new TypeError(message);
      }

      return argument;
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
