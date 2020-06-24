import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Department } from '../models/department.model';
import { Employee } from '../models/employee.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { EmployeeService } from './employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';


@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],

})
export class CreateEmployeeComponent implements OnInit, AfterViewChecked {

  panelTitle: string;
  @ViewChild('employeeForm') public createEmployeeForm: NgForm;

  employee: Employee;
  
  departments: Department[] = [
    { id: 1, name: 'Help Desk' },
    { id: 2, name: 'HR' },
    { id: 3, name: 'IT' },
    { id: 4, name: 'Payroll' }
  ];

  datePickerConfig: Partial<BsDatepickerConfig>;
  previewPhoto = false;
  holder: any;
  isLoading: boolean;
  url: string;
  isLoaded: boolean;
  renderer: any;

  constructor(private _employeeService: EmployeeService, private _router: Router,
    private _route: ActivatedRoute, private cd: ChangeDetectorRef) {
    this.datePickerConfig = Object.assign({},
      {
        containerClass: 'theme-dark-blue',
        showWeekNumbers: false,
        dateInputFormat: 'MM/DD/YYYY',
      });
  }

  ngOnInit(): void {

    setTimeout(() =>
      this._route.paramMap.subscribe(parameterMap => {
        const id = +parameterMap.get('id');
        console.log('in ng on init event: ' + id);
        this.getEmployee(id);
      }), 0);

  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  togglePhotoPreview() {
    this.previewPhoto = !this.previewPhoto;
  }


  private getEmployee(id: number) {

    if (id === 0) {
      this.employee = {
        id: null,
        name: null,
        gender: null,
        contactPreference: null,
        phoneNumber: null,
        email: null,
        dateOfBirth: null,
        department: null,
        isActive: null,
        photoPath: null
      };
      // Resetting the form, resets any previous validation errors
      console.log('from create new employee: ');
      this.createEmployeeForm.reset();
      console.log('from create new employee: 2');
      this.panelTitle = 'Create Employee';
    } else {
      this._employeeService.getEmployee(id).subscribe(
        (employee) => this.employee = employee,
        (err: any) => console.log('from create : ' + err)
      );
      this.panelTitle = 'Edit Employee';
    }
  }
  saveEmployee(): void {
    if (this.employee.id == null) {
      this._employeeService.save(this.employee).subscribe(
        (data: Employee) => {
          console.log(data);
          this.createEmployeeForm.reset();
          this._router.navigate(['list']);
        },
        (error: any) => {
          console.log(error);
        });
    } else {
      this._employeeService.updateEmployee(this.employee).subscribe(
        () => {
          this.createEmployeeForm.reset();
          this._router.navigate(['list']);
        },
        (error: any) => {
          console.log(error);
        });
    }
  }

}
