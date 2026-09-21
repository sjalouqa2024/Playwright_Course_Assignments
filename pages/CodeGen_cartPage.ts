 
 import { Page, Locator } from "@playwright/test";
 import { CodeGenBasePage } from "./CodeGen_basePage";
 
 export class CodeGen_cartPage extends CodeGenBasePage {

// ==================== Navigation Elements ====================
    public readonly homeButton: Locator;
    public readonly ordersButton: Locator;
    public readonly cartButton: Locator;
    public readonly signOutButton: Locator;


  // ==================== Cart Header ====================
    public readonly pageTitle: Locator;  // "My Cart" heading
    public readonly continueShoppingButton: Locator;

  // Product Image
  public readonly productImage: Locator;

  // Product Information
  public readonly itemNumber: Locator;
  public readonly productName: Locator;
  public readonly stockStatus: Locator;

  // Product Total Price
  public readonly itemTotal: Locator;


  // Action Buttons
  public readonly buyNowButton: Locator;
  public readonly removeButton: Locator;
  public readonly checkOut: Locator;


   constructor (page:Page)
    {
        super(page);
        //Navigation 
    this.homeButton = page.getByRole("button", { name: /HOME/i });
        this.ordersButton = page.getByRole("button", { name: /ORDERS/i });
        this.cartButton = page.getByRole("button", { name: /Cart/i });
        this.signOutButton = page.getByRole("button", { name: /Sign Out/i });
   
        // "My Cart" heading
        this.pageTitle = page.getByRole("heading", { name: /My Cart/i });
      // "Continue Shopping" button 
        this.continueShoppingButton = page.getByRole("button", { name: /Continue Shopping/i });
        // Product Image
    this.productImage = page.locator("ul.cartWrap li.items img.itemImg");

    // Product Information
    this.itemNumber = page.locator("ul.cartWrap li.items p.itemNumber");
    this.productName = page.locator("ul.cartWrap li.items h3");
    this.stockStatus = page.locator("ul.cartWrap li.items p.stockStatus");


    // Product Total Price
    this.itemTotal = page.locator("ul.cartWrap li.items div.prodTotal");

    // Action Buttons
    this.buyNowButton = page.locator("ul.cartWrap li.items button:has-text('Buy Now')");
    this.removeButton = page.locator("ul.cartWrap li.items button.btn-danger");
    this.checkOut=page.locator("div.subtotal button.btn-primary:has-text('Checkout')");

  }


  async getProductName():Promise<string>
  {
    return await this.productName.textContent()||"";
  }
  async clickCheckoutButton(): Promise<void> {
  await this.checkOut.waitFor();  
  await  this.checkOut.click();
}
 }