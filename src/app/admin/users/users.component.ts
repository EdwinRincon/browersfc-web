import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, Sort, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserResponse, ApiSuccessResponse, PaginatedResponse, PaginationParams, ApiErrorResponse } from '../../core/interfaces';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit, AfterViewInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly baseUrl = environment.API_URL;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Signals for reactive state
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isMobile = signal<boolean>(false);

  // MatTableDataSource for better data management
  protected readonly dataSource = new MatTableDataSource<UserResponse>([]);
  protected readonly totalUsers = signal<number>(0);

  // Computed for responsive behavior
  protected readonly showMobileView = computed(() => this.isMobile());

  // Table configuration
  protected readonly displayedColumns = ['id', 'username', 'name', 'last_name', 'role_id', 'created_at', 'updated_at', 'actions'];
  protected readonly pageSizeOptions = [5, 10, 25, 50];

  // Pagination parameters using interface
  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 5,
    sort: 'id',
    order: 'asc'
  });

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadUsers();

    // Listen for window resize
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  ngAfterViewInit(): void {
    // Setup MatTableDataSource with proper sorting only
    // Do NOT assign paginator to dataSource as we handle pagination server-side
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    // Configure paginator properly for server-side pagination
    if (this.paginator) {
      const params = this.paginationParams();
      this.paginator.pageIndex = params.page;
      this.paginator.pageSize = params.pageSize;
    }
  }


  /**
   * Check screen size for responsive behavior
   */
  private checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  /**
   * Load users with pagination and sorting
   */
  protected loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    const params = this.paginationParams();
    const queryParams = {
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      sort: params.sort || 'id',
      order: params.order || 'asc'
    };

    const url = `${this.baseUrl}/users`;

    this.http.get<ApiSuccessResponse<PaginatedResponse<UserResponse>>>(url, { params: queryParams })
      .pipe(
        map((response: ApiSuccessResponse<PaginatedResponse<UserResponse>>) => response.data)
      )
      .subscribe({
        next: (response: PaginatedResponse<UserResponse>) => {
          this.dataSource.data = response.items;
          this.totalUsers.set(response.total_count);

          // Update paginator to reflect current state after change detection
          setTimeout(() => {
            if (this.paginator) {
              this.paginator.pageIndex = params.page;
              this.paginator.length = response.total_count;
              this.cdr.detectChanges(); // Force change detection
            }
          }, 0);

          this.loading.set(false);
        },
        error: (err: ApiErrorResponse) => {
          console.error('Error loading users:', err);
          console.error('Error details:', {
            url: err.detail,
            code: err.code,
            message: err.message
          });
          this.error.set('Error loading users. Please try again.');
          this.loading.set(false);
        }
      });
  }

  /**
   * Handle page change event
   */
  protected onPageChange(event: PageEvent): void {
    // Update pagination parameters
    this.paginationParams.update(params => ({
      ...params,
      page: event.pageIndex, // pageIndex is 0-based, which matches backend expectation
      pageSize: event.pageSize
    }));

    // Load the new data
    this.loadUsers();
  }

  /**
   * Handle sort change event
   */
  protected onSortChange(sort: Sort): void {
    if (sort.direction) {
      this.paginationParams.update(params => ({
        ...params,
        sort: sort.active,
        order: sort.direction as 'asc' | 'desc'
      }));
    } else {
      // Default sort when direction is ''
      this.paginationParams.update(params => ({
        ...params,
        sort: 'id',
        order: 'asc'
      }));
    }
    this.loadUsers();
  }

  /**
   * Update user (placeholder implementation)
   */
  updateUser(userId: number, userData: Partial<UserResponse>): void {
    console.log('Update user:', userId, userData);
    // Implementation pending - will be added in future iterations
  }

  /**
   * Delete user (placeholder implementation)
   */
  deleteUser(userId: number): void {
    console.log('Delete user:', userId);
    // Implementation pending - will be added in future iterations
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toUTCString();
  }
}