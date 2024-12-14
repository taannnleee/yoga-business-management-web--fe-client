export interface Product {
    id: number;
    imagePath: string;
    status: string | null;
    price: number;
    title: string;
    subCategory: {
        id: number;
        name: string;
    };
    code: string;
    brand: string;
    description: string;
    averageRating: number;
    variants: ProductVariant;
}