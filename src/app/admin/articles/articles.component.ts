import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { ArticleResponse, PaginationParams } from '../../core/interfaces';
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
export class ArticlesComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly articleService = inject(ArticleService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected readonly isMobile = signal<boolean>(false);
  protected readonly showMobileView = computed(() => this.isMobile());

  protected readonly displayedColumns = ['id', 'title', 'season', 'date', 'img_banner', 'created_at', 'updated_at', 'actions'];
  protected readonly pageSizeOptions = [5, 10, 25, 50];

  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 5,
    sort: 'date',
    order: 'desc'
  });

  // stable resource that updates based on signal
  protected readonly paginatedArticles = this.articleService.getArticlesResource(this.paginationParams);

  // Helper to get items from resource
  protected get paginatedItems() {
    return this.paginatedArticles.value()?.data.items ?? [];
  }

  // Helper to get total count from resource
  protected get paginatedTotal() {
    return this.paginatedArticles.value()?.data.total_count ?? 0;
  }

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