import {Availability} from "./Availability";
import {Product} from "./Product"
import {fetchJSON} from "./index"

const availabilityApiUrl = "https://bad-api-assignment.reaktor.com/availability";

type AvailabilityMap = Record<string, Promise<AvailabilityData>>;

interface AvailabilityData {
    code: number,
    response: Availability[]
}

export class AvailabilityRepository {

    cache: AvailabilityMap = {};

    constructor() {
    }

    async fetchAvailability(product: Product): Promise<AvailabilityData> {
        if (!this.cache[product.manufacturer]) {
            this.cache[product.manufacturer] = fetchJSON(`${availabilityApiUrl}/${product.manufacturer}`)
        }
        return this.cache[product.manufacturer]
    }

    async getAvailabilityIndicator(product: Product): Promise<string> {
        return this.fetchAvailability(product)
        .then((data: AvailabilityData) => {
           return this.findAvailability(data.response, product);
        })
    }

    async findAvailability(availabilities: Availability[], product: Product): Promise<string> {
        for (let availability of availabilities) {
            if (availability.id.toLowerCase()===product.id) {
                return this.parseAvailability(availability.DATAPAYLOAD);
            }
        }
        return "?";
    }

    parseAvailability(payload: string): string {
        return payload.includes("OUTOFSTOCK") ? "Out of stock" : payload.includes("LESS") ? "Less than 10" : "In stock";
    }
}