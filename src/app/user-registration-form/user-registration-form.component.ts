import { Component, OnInit, Input } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';

import { MatSnackBar } from '@angular/material/snack-bar';

/** UserRegistrationFormComponent is a component used to register new user */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent implements OnInit {
  /** Input data for the user @type {object} - Property username,password,email,birth to be in string}*/
  @Input() userData = {
    userName: '',
    password: '',
    email: '',
    birth: '',
  };

  /**
   * Constructor for WelcomePageComponent
   * @param {FetchApiDataService} -> fetchApiData - FetchApiDataService instance
   * @param {MatDialogRef} -> dialogRef - MatDialogRef instance
   * @param {MatSnackBar} - snackBar - MatSnackBar instance
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  /** Registers a user
   * Calls the API to register the user's profile.
   * Sends a registration request to the API and handles the response
   * @returns {void}
   */
  registerUser(): void {
    this.fetchApiData.registration(this.userData).subscribe(
      (response) => {
        this.dialogRef.close();
        this.snackBar.open('user registered successfully', 'OK', {
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
