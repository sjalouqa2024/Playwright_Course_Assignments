import { type Locator, type Page, expect } from "@playwright/test";

export class SpecialLocator_ShopPage  {
 
  constructor(private page: Page) {}
  async openWebsite() {
    await this.page.goto("https://rahulshettyacademy.com/angularpractice/shop");
  }

    private productCard(name:string){
      return this.page.locator("app-card").filter({hasText:name});

    }
    async addProduct (name:string)
    {
      await this.productCard(name).getByRole("button",{name:"Add"}).click();
    }
  private get CartLink(){
  return this.page.getByText(/Checkout\s*\(/);
}
async opeCart()
{
  await this.CartLink.click();
}
  
  }
