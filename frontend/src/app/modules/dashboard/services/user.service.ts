import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  finalize,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
  timer,
} from 'rxjs';
import {
  DisplayDelete,
  DisplayUser,
  User,
} from '../../../shared/models/user.model';
import { UserApiService } from './user-api.service';

@Injectable()
export class UserService {
  private user = new BehaviorSubject<User[]>([]);
  user$ = this.user.asObservable();

  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(private userApiService: UserApiService) {}

  getUsers(): void {
    const user = this.user.getValue();
    if (user && user?.length > 0) return;

    this.isLoading.next(true);
    this.userApiService
      .findAll()
      .pipe(
        switchMap((res) => timer(0).pipe(map(() => res))),
        finalize(() => this.isLoading.next(false))
      )
      .subscribe((users) => users.length && this.user.next(users));
  }

  getUsersForDisplay(): Observable<DisplayUser[] | null> {
    return this.user$.pipe(
      map((users) =>
        users.map((user, index) => ({
          id: user.id,
          no: index + 1,
          avatar: user.avatar,
          email: user.email,
          name: `${user.firstname} ${user.lastname}`,
          verified: user.verified,
          active: user.active,
          roles: user.Roles.join(', '),
        }))
      )
    );
  }

  getUsersForDelete(): Observable<DisplayDelete[] | null> {
    return this.user$.pipe(
      map((users) =>
        users.map((user, index) => ({
          id: user.id,
          no: index + 1,
          avatar: user.avatar,
          email: user.email,
        }))
      )
    );
  }

  getUserByEmail(email: string) {
    this.isLoading.next(true);

    return this.user$.pipe(
      take(1),
      map((users) => users.find((user) => user.email === email)),
      switchMap((user) => {
        if (user) return of(user);
        return this.userApiService.findByEmail(email);
      }),
      switchMap((res) => timer(0).pipe(map(() => res))),
      finalize(() => this.isLoading.next(false))
    );
  }

  update(id: number, body: Partial<User>) {
    this.isLoading.next(true);

    return this.userApiService.update(id, body).pipe(
      tap((res) => {
        const users = this.user.getValue();
        const index = users.findIndex((user) => user.id === id);

        if (index !== -1) {
          users[index] = { ...users[index], ...body };
          this.user.next(users);
        }
      }),
      finalize(() => this.isLoading.next(false))
    );
  }

  updateUserRoles(id: number, body: Partial<User>) {
    this.isLoading.next(true);

    return this.userApiService.updateUserRoles(id, body).pipe(
      tap((res) => {
        const users = this.user.getValue();
        const index = users.findIndex((user) => user.id === id);

        if (index !== -1) {
          users[index] = { ...users[index], ...body };
          this.user.next(users);
        }
      }),
      finalize(() => this.isLoading.next(false))
    );
  }

  delete(id: number) {
    this.isLoading.next(true);

    return this.userApiService.delete(id).pipe(
      tap((res) => {
        const users = this.user.getValue();
        const index = users.findIndex((user) => user.id === id);

        if (index !== -1) {
          users.splice(index, 1);
          this.user.next(users);
        }
      }),
      finalize(() => this.isLoading.next(false))
    );
  }
}
