import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { UserResponse, PaginationParams } from '../../core/interfaces';
import { UserService } from '../../services/user/user.service';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly userService = inject(UserService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected readonly isMobile = signal<boolean>(false);
  protected readonly showMobileView = computed(() => this.isMobile());

  protected readonly displayedColumns = ['id', 'username', 'name', 'last_name', 'role_id', 'created_at', 'updated_at', 'actions'];
  protected readonly pageSizeOptions = [10, 25, 50];

  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 10,
    sort: 'created_at',
    order: 'desc'
  });

  // Signal-powered resource for paginated users
  protected readonly paginatedUsers = this.userService.getUsersResource(this.paginationParams);

  private readonly resizeListener = () => this.checkScreenSize();

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe(event => this.onPageChange(event));
    }
  }

  private checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  protected onPageChange(event: PageEvent): void {
    this.paginationParams.update(params => ({
      ...params,
      page: event.pageIndex,
      pageSize: event.pageSize
    }));
  }

  protected onSortChange(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.paginationParams.update(params => ({
        ...params,
        sort: 'created_at',
        order: 'desc'
      }));
    } else {
      this.paginationParams.update(params => ({
        ...params,
        sort: sort.active,
        order: sort.direction as 'asc' | 'desc'
      }));
    }
  }

  updateUser(userId: string, userData: Partial<UserResponse>): void {
    //TODO: Implementation pending - will be added in future
  }

  deleteUser(userId: string): void {
    //TODO: Implementation pending - will be added in future
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}