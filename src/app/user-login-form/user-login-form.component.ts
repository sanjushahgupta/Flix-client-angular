import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

/** UserRegistrationFormComponent is a component used to register new user */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  /** Input data for the user @type {object} - Property username,password should be in string}*/
  @Input() userData = { userName: '', password: '' };

  /**
   * Constructor for WelcomePageComponent
   * @param {FetchApiDataService} -> fetchApiData - FetchApiDataService instance
   * @param {MatDialogRef} -> dialogRef - MatDialogRef instance
   * @param {MatSnackBar} - snackBar - MatSnackBar instance
   * @param {Router} - router - Router instance
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public diagolRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

  /** login a user
   * Calls the API to login the user's profile.
   * Sends a login request to the API and handles the response
   * @returns {void}
   */
  loginUser(): void {
    this.fetchApiData.login(this.userData).subscribe(
      (response) => {
        this.router.navigate(['movies']);
        this.diagolRef.close();
        this.snackBar.open('Login successful', 'OK', {
          duration: 2000,
        });
      },
      (response) => {
        this.snackBar.open(response, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
