
import {UIState} from "./UIState";
import {ProductModel} from "./ProductModel";
import {ProductView} from "./ProductView";
import { AvailabilityRepository } from "./AvailabilityRepository";

async function main() {
    const productListContainer = document.createElement('div');
    productListContainer.classList.add("container");

    let uiState: UIState = {
        currentPage: 0,
        currentCategory: "jackets",
    }
    const productModel = new ProductModel(uiState);
    const availabilityRepository = new AvailabilityRepository();
    const productView = new ProductView(productListContainer, productModel, availabilityRepository);
    
    createTabs(productModel, productView);

    document.body.appendChild(productListContainer);
    addPagingButtonToDocument("<<<", false, productModel, productView);
    addPagingButtonToDocument(">>>", true, productModel, productView);

    productView.refreshProducstList();
}

function createTabs(productModel: ProductModel, productView: ProductView) {
    const tabs = document.createElement('div');
    tabs.classList.add("tabs");
    document.body.appendChild(tabs);
    productModel.categories.forEach(category => {
        const tab = document.createElement('button');
        tab.textContent = category;
        tab.onclick = () => {
            productModel.selectCategory(category);
            productView.refreshProducstList();
        };
        tabs.appendChild(tab);
    });
}

function addPagingButtonToDocument(caption: string, increment: boolean, productModel: ProductModel, productView: ProductView) {
    const button = document.createElement('button');
    button.textContent = caption;
    button.onclick = () => {
        increment ? productModel.nextPage() : productModel.prevPage();
        productView.refreshProducstList();
    };
    document.body.appendChild(button);
}

export async function fetchJSON(url: string) { 
    const response = await fetch(url)
    const json = await response.json()       
    return json
}

main();