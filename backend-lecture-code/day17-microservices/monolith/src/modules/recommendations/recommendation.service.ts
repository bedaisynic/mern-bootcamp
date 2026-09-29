import { Product } from "../../shared/types";
import { catalogService } from "../catalog/catalog.service";

// No repository: this module has no table of its own. It reads products
// through the catalog module's service, the same way any module would.

function burnCpu(ms: number): void {
  const end = Date.now() + ms;
  let x = 0;
  while (Date.now() < end) x += Math.sqrt(x + 1);
}

export const recommendationService = {
  // DEMO: stands in for scoring every product with a heavy model. It's
  // synchronous on purpose. Node runs your code on one thread, so while this
  // loop runs, no other request gets served, in ANY module.
  async recommend(ms: number): Promise<Product[]> {
    burnCpu(ms);
    const products = await catalogService.listProducts();
    return products.sort(() => Math.random() - 0.5).slice(0, 3);
  },
};
