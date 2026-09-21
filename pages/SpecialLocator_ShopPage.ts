import { type Locator, type Page, expect } from "@playwright/test";
import { SpecialLocator_basePage } from "./SpecialLocator_basePage.ts";

export class SpecialLocator_ShopPage extends SpecialLocator_basePage {
  public readonly shopHeader: Locator;
  public readonly shopName: Locator;
  public readonly Category_1: Locator;
  public readonly Category_2: Locator;
  public readonly Category_3: Locator;
  public readonly Third_slide: Locator;
  public readonly allProductCards: Locator;
  public readonly firstProductCard: Locator;
  public readonly lastProductCard: Locator;
  public readonly Checkout_Button: Locator;

  constructor(page: Page) {
    super(page);
    this.shopHeader = page.getByRole("link", { name: "ProtoCommerce Home" });
    this.shopName = page.getByRole("heading", { name: "Shop Name" });
    this.Category_1 = page.getByRole("link", { name: "Category 1" });
    this.Category_2 = page.getByRole("link", { name: "Category 2" });
    this.Category_3 = page.getByRole("link", { name: "Category 3" });
    this.Third_slide = page.getByRole("img", { name: "Third slide" });
    this.allProductCards = page.locator("app-card");
    this.firstProductCard = this.allProductCards.first();
    this.lastProductCard = this.allProductCards.last();
    this.Checkout_Button = page.locator("a.nav-link.btn.btn-primary");
  }

  override async openShopPage(): Promise<void> {
    await super.openShopPage();
    await expect(this.allProductCards.first()).toBeVisible();
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.page
      .locator("app-card")
      .filter({ hasText: productName })
      .getByRole("button", { name: "Add" })
      .click();
  }

  async addFirstProduct(): Promise<void> {
    await this.firstProductCard.getByRole("button", { name: "Add" }).click();
  }

  async addLastProduct(): Promise<void> {
    await this.lastProductCard.getByRole("button", { name: "Add" }).click();
  }
}