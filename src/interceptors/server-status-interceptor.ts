import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';
import {ROUTES_CONSTANTS} from '../env/env';


export const serverStatusInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);


  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
        if(err.status ===0)
        {
          router.navigate([ROUTES_CONSTANTS.SERVER_DOWN])
        }
      return throwError(() => err);
    })
  );
};
