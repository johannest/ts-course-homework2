import {Product} from "./Product"
import {UIState} from "./UIState";
import {fetchJSON} from "./index"

const productsApiUrl = "https://bad-api-assignment.reaktor.com/products";

type ProductMap = Record<string, Promise<Product[]>>;

export class ProductModel {
    pageSize = 15;
    cache: ProductMap = {};
    categories = ["jackets", "shirts", "accessories"];
    uiState;

    constructor(uiState: UIState) {
        this.uiState = uiState;
    }

    async fetchProducts(category: string): Promise<Product[]> {
        if (!this.cache[category]) {
            this.cache[category] = fetchJSON(`${productsApiUrl}/${category}`)
        }
        return this.cache[category]
    }

    async getPage(): Promise<Product[]> {
        const offset = this.uiState.currentPage*this.pageSize;
        return (await this.fetchProducts(this.uiState.currentCategory)).slice(offset, offset+this.pageSize);
    }

    nextPage() {
        this.uiState.currentPage++;
    }

    prevPage() {
        if (this.uiState.currentPage > 0) {
            this.uiState.currentPage--;
        }
    }

    selectCategory(category: string) {
        this.uiState.currentPage = 0;
        this.uiState.currentCategory = category;
    }
}