import {Component, inject, OnInit, signal} from '@angular/core';
import {ToastService} from '../../services/toast/toast-service';



import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors, ValidatorFn,
  Validators
} from '@angular/forms';
import {AuthService} from '../../services/auth/auth-service';
import {Router} from '@angular/router';
import {ROUTES_CONSTANTS} from '../../env/env';
import {jwtDecode} from 'jwt-decode';
import {TransactionsService} from '../../services/transactions/transactions-service';
import {Observable} from 'rxjs';
import {CurrencyMasterDTO} from '../../models/transaction';
import {UserMaster} from '../../models/login';

@Component({
  selector: 'app-auth',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth  implements OnInit {
  protected loginForm!: FormGroup;
  protected registerForm!: FormGroup;
user = signal<UserMaster>({} as UserMaster);
  transactionService  =  inject(TransactionsService);
  toastService =  inject(ToastService);
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  router = inject(Router);
  isLoginForm : boolean = true;
  currencies =  signal<CurrencyMasterDTO[]>([]);

  ngOnInit() {
    this.initializeLoginForm();
    this.initializeRegisterForm();
  }


  initializeLoginForm(){
    this.loginForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  initializeRegisterForm(){
    this.getAllCurrencies();
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/
          )]],
        confirmPassword: ['', Validators.required],
        currencyMasterId : [null, Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  onSubmit()  {

    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
    }
    else
    {
      const payload  = this.loginForm.value;
      this.authService.loginUser(payload).subscribe({
        next: (res: any) => {
          // Success response (2xx)
          if (res.success) {
            const token = res.data;
            this.authService.saveToken(token);
            this.getUserDetails(this.authService.userId());
            this.authService.isLoggedIn.set(true);
            this.toastService.show(res.message || "Login successful!", "success");
            this.router.navigate([ROUTES_CONSTANTS.DASHBOARD]);
          }
        },
        error: (err: any) => {
          // Error response (4xx/5xx)
          console.log('Login error response:', err);
          const message = err?.error?.message || "Something went wrong, please try again";
          this.toastService.show(message, "error");
        }
      });

      console.log(this.loginForm.value);
    }
  }

  getUserDetails(userId: string){
    this.authService.getUserDetails(userId).subscribe( result =>
    {
      if(result.success)
      {
        this.user.set(result.data);
        // ✅ Store in localStorage
        localStorage.setItem('userDetails', JSON.stringify(result.data));
      }

    })
  }


  onSubmitRegister()  {

    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
    }
    else
    {
      const payload  = this.registerForm.value;
      this.authService.registerUser(payload).subscribe({
        next: (res) => {
          this.toastService.show("Register successfully!", "success");
          this.registerForm.reset();
          this.isLoginForm = true;

        },
        error: (err) => {
          this.toastService.show(err.error?.message || 'Something went wrong', 'error');
        }
      });

    }
  }

  getAllCurrencies(){

    this.transactionService.getAllCurrencies().subscribe({
      next: (res) =>{
        if(res.success)
        {
          this.currencies.set(res.data);
        }
      }
    })
  }



  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {

    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    // if either field is empty, don't show error yet
    if (!password.value || !confirmPassword.value) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  };
}
