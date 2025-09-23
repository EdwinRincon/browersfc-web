import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { ArticleResponse, PaginationParams, ApiErrorResponse } from '../../core/interfaces';
import { MaterialModule } from '../../material/material.module';
import { ArticleService } from '../../services/article/article.service';

@Component({
  selector: 'app-articles',
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlesComponent implements OnInit, AfterViewInit {
  private readonly articleService = inject(ArticleService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isMobile = signal<boolean>(false);

  // MatTableDataSource for articles and total count
  protected readonly dataSource = new MatTableDataSource<ArticleResponse>([]);
  protected readonly totalArticles = signal<number>(0);

  // Computed for responsive behavior
  protected readonly showMobileView = computed(() => this.isMobile());

  // Table configuration
  protected readonly displayedColumns = ['id', 'title', 'season', 'date', 'img_banner', 'created_at', 'updated_at', 'actions'];
  protected readonly pageSizeOptions = [5, 10, 25, 50];

  // Pagination parameters using interface
  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 5,
    sort: 'date',
    order: 'desc'
  });

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadArticles();

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
   * Load articles with pagination and sorting
   */
  protected loadArticles(): void {
    this.loading.set(true);
    this.error.set(null);

    const params = this.paginationParams();

    this.articleService.getArticles(params).subscribe({
      next: (response) => {
        this.dataSource.data = response.items;
        this.totalArticles.set(response.total_count);

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
        console.error('Error loading articles:', err);
        this.error.set('Error loading articles. Please try again.');
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
    this.loadArticles();
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
      this.paginationParams.update(params => ({
        ...params,
        sort: 'date',
        order: 'desc'
      }));
    }
    this.loadArticles();
  }

  /**
   * Update article
   */
  updateArticle(articleId: number, articleData: Partial<ArticleResponse>): void {
    console.log('Update article:', articleId, articleData);
    // Implementation pending
  }

  /**
   * Delete article
   */
  deleteArticle(articleId: number): void {
    console.log('Delete article:', articleId);
    // Implementation pending
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Check if article has banner image
   */
  hasBannerImage(article: ArticleResponse): boolean {
    return !!article.img_banner;
  }

  /**
   * Check if article has no banner image
   */
  hasNoBannerImage(article: ArticleResponse): boolean {
    return !article.img_banner;
  }
}