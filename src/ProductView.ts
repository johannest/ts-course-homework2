import {ProductModel} from "./ProductModel";
import {Product} from "./Product"
import {AvailabilityRepository} from "./AvailabilityRepository";

type AvailabilityDivMap = Record<string, Element>;

export class ProductView {
    productListContainer: Element;
    productModel: ProductModel;
    availabilityRepository: AvailabilityRepository; 

    constructor(productListContainer: Element, productModel: ProductModel, availabilityRepository: AvailabilityRepository) {
        this.productListContainer = productListContainer;
        this.productModel = productModel;
        this.availabilityRepository = availabilityRepository;
    }

    async refreshProducstList() {
        this.productListContainer.innerHTML = "";
        const productsList: Product[] = await this.productModel.getPage();
        
        for (let name of ['Type','Name','Price','Availability']) {
            this.createAndAppendDiv(this.productListContainer, name).classList.add("header");    
        }
    
        const availabilityDivs: AvailabilityDivMap = {};
        productsList.forEach(prod => {
            this.createAndAppendDiv(this.productListContainer, prod.type);
            this.createAndAppendDiv(this.productListContainer, prod.name);
            this.createAndAppendDiv(this.productListContainer, prod.price.toString());

            availabilityDivs[prod.id] = this.createAndAppendDiv(this.productListContainer, "loading...");
        });
        
        for (let product of productsList) {
            availabilityDivs[product.id].textContent = await this.availabilityRepository.getAvailabilityIndicator(product);
        }      
    }

    createAndAppendDiv(container: Element, content: string) {
        var divElem = document.createElement('div');
        divElem.textContent = content;
        container.appendChild(divElem);
        return divElem;
    }
}