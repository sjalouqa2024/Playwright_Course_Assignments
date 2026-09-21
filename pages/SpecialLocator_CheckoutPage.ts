import { Page, Locator ,expect} from "@playwright/test";
import { SpecialLocator_basePage } from "./SpecialLocator_basePage";

export class SpecialocatorsCheckoutPage extends SpecialLocator_basePage {
  public readonly checkoutTable: Locator;
    public readonly total: Locator;
    public readonly continueShoppingButton: Locator;
    public readonly checkoutButton: Locator;
    constructor (page:Page)
    {
        super(page);
        this.checkoutTable = page.locator("table");
        this.total = page.locator("tbody tr").filter({ hasText: "Total" }).locator("h3 strong");
        this.continueShoppingButton = page.getByRole("button", { name: "Continue Shopping" });
        this.checkoutButton = page.getByRole("button", { name: "Checkout" });
    }
    override async openShopPage(): Promise<void> {
    await super.openShopPage();
    await expect(this.checkoutTable).toBeVisible();
}
     
    }