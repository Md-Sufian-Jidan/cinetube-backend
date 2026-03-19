export interface IReview {
    rating: number;
    content: string;
    tags: string[];
    isSpoiler: boolean;
    mediaId: string;
    userId: string;
}

export interface IUpdateReview {
    rating?: number;
    content?: string;
    tags?: string[];
    isSpoiler?: boolean;
    mediaId: string;
    userId: string;
}

export interface IComment {
    content: string;
    reviewId: string;
    parentId?: string;
    userId: string;
}
