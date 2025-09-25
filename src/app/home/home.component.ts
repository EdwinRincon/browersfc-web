import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ArticleService } from '../services/article/article.service';
import { ArticleResponse } from '../core/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage]
})
export class HomeComponent implements OnInit {

  // Modern dependency injection
  private readonly articleService = inject(ArticleService);

  // Signal for loading state
  protected readonly isLoading = signal(false);
  
  // Signal for articles data
  protected readonly articles = signal<ArticleResponse[]>([]);

  ngOnInit(): void {
    this.loadArticles();
  }

  private loadArticles(): void {
    this.isLoading.set(true);
    this.articleService.getArticles({ page: 0, pageSize: 6, sort: 'date', order: 'desc' })
      .subscribe({
        next: (resp: any) => {
          this.articles.set(resp.data?.items || []);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }
}
