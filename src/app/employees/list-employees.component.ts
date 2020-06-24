import { Component, OnInit } from '@angular/core';
import { Employee } from '../models/employee.model';
import { EmployeeService } from './employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ResolvedEmployeeList } from './resolved-employeelist.model';

@Component({
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {

  _searchTerm: string;
  employees: Employee[];
  filteredEmployees: Employee[];
  error: string;

  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(value: string) {
    this._searchTerm = value;
    this.filteredEmployees = this.filterEmployees(value);
  }

  constructor(private _employeeService: EmployeeService,
              private _router: Router, private _route: ActivatedRoute) {
                const resolvedEmployeeList: ResolvedEmployeeList = this._route.snapshot.data['employeeList'];
                if (resolvedEmployeeList.error == null)
                {
                  this.employees = resolvedEmployeeList.employeeList;
                }
                else {
                  this.error = resolvedEmployeeList.error;
                }
                if (this._route.snapshot.queryParamMap.has('searchTerm')) {
                  this.searchTerm = this._route.snapshot.queryParamMap.get('searchTerm');
                } else {
                  this.filteredEmployees = this.employees;
                }
              }

  ngOnInit(): void {
    // this._employeeService.getEmployees().subscribe((empList) => {
    //   this.employees = empList;
    //   this._route.queryParamMap.subscribe((params) => {
    //     if (params.has('searchTerm')) {
    //       this.searchTerm = params.get('searchTerm');
    //     } else {
    //       this.filteredEmployees = this.employees;
    //     }
    //   });
    // });
  }

  onDeletenotification(id: number){
    const i = this.filteredEmployees.findIndex(e => e.id === id);
    if (i !== -1) {
      this.filteredEmployees.splice(i, 1);
      console.log('event transmitted');
    }
  }

  filterEmployees(searchString: string) {
    return this.employees.filter(employee =>
      employee.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
  }

}
