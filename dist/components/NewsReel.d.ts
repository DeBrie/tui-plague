import React from 'react';
import { NewsItem } from '../types.js';
interface NewsReelProps {
    newsItems: NewsItem[];
    maxItems?: number;
}
export declare const NewsReel: React.FC<NewsReelProps>;
export {};
