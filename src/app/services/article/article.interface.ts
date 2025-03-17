export interface Season {
    id: number;
    year: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Article {
    id: number;
    title: string;
    content: string;
    img_banner: string;
    date: string;
    seasons_id: number;
    seasons: Season;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
  }
  
  export interface ArticleResponse {
    data: Article[];
    message: string;
  }
  
  export interface ArticlePagination {
    page: number;
    pageSize: number;
  }