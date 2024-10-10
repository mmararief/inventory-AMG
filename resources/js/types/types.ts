export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface Brand {
    id: number;
    name: string;
    description: string;
}

export interface Type {
    id: number;
    name: string;
    category_id: number; // Assuming each type has a category_id
}

export interface Product {
    product_code: string;
    id: number;
    name: string;
    description: string;
    price: number;
    type_id: number;
    category_id: number;
    brand_id: number;
    category: Category;
    brand: Brand;
    type: Type;
}

export interface Location {
    id: number;
    name: string;
    volume: number;
    remaining_volume: number;

}

export interface Inventory {
    id: number;
    product: Product;
    quantity: number;
    location: Location;
}