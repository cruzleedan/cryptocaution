import { Entity } from './entity.model';

export interface Review {
    id: string;
    entityId: number;
    userId: number;
    username?: string;
    reviewCount?: number;
    avatar?: string;
    title: string;
    review: string;
    upvoteTally: number;
    downvoteTally: number;
    rating: number;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
    Entity?: Entity;
}
