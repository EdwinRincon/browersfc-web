import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { UserResponse, PaginatedResponse, PaginationParams } from '../../core/interfaces';
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
export class UsersComponent implements OnInit, AfterViewInit {

  private readonly userService = inject(UserService);
  private readonly cdr = inject(ChangeDetectorRef);

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
  protected readonly pageSizeOptions = [10, 25, 50];

  // Pagination parameters using interface
  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 10,
    sort: 'created_at',
    order: 'desc'
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
    this.userService.getUsers(params)
      .subscribe({
        next: (response: PaginatedResponse<UserResponse>) => {
          this.dataSource.data = response.items;
          this.totalUsers.set(response.total_count);
          setTimeout(() => {
            if (this.paginator) {
              this.paginator.pageIndex = params.page;
              this.paginator.length = response.total_count;
              this.cdr.detectChanges();
            }
          }, 0);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading users:', err);
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
    console.log('Sort change detected:', sort.direction);
    if (!sort.active || sort.direction === '') {
      // Reset to default sort (or send no sort to backend)
      this.paginationParams.update(params => ({
        ...params,
        sort: 'created_at', 
        order: 'desc'
      }));
    } else {
      const order: 'asc' | 'desc' = sort.direction === 'asc' ? 'asc' : 'desc';
      this.paginationParams.update(params => ({
        ...params,
        sort: sort.active,
        order
      }));
    }
    this.loadUsers();
  }

  /**
   * Update user 
   */
  updateUser(userId: string, userData: Partial<UserResponse>): void {
    //TODO: Implementation pending - will be added in future
  }

  /**
   * Delete user 
   */
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