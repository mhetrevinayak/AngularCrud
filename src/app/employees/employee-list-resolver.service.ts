import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Employee } from '../models/employee.model';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { EmployeeService } from './employee.service';
import { ResolvedEmployeeList } from './resolved-employeelist.model';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class EmployeeListResolverService implements Resolve<ResolvedEmployeeList> {
    // Inject the employeee service as we need it to retrieve employee data
    constructor(private _employeeService: EmployeeService) {
    }
    // Resolve interface contains the following one method for which we need to
    // provide implementation. This method calls EmployeeService & returns employee data
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResolvedEmployeeList> {
        return this._employeeService.getEmployees()
        .pipe(
            map((employeeList) => new ResolvedEmployeeList(employeeList)),
            catchError((err: any) => of(new ResolvedEmployeeList(null, err)))
        );
    }
}
