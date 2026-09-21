import { Page, Locator} from "@playwright/test";
import { CodeGenBasePage } from "./CodeGen_basePage";

export class CodeGen_dashBoardPage extends CodeGenBasePage {
    public readonly ordersButton : Locator;
    public readonly cartButton : Locator;
    public readonly signOutButton : Locator;
    public readonly blinkingText  : Locator;
    public readonly qaCareerLink  : Locator;
    public readonly cartCountBadge: Locator;
    // Search Input
    public readonly searchInput : Locator;
    // Price Range Inputs
    public readonly minPriceInput: Locator; 
    public readonly maxPriceInput: Locator; 
    // Category Checkboxes
    public readonly fashionCheckbox : Locator;
    public readonly electronicsCheckbox : Locator;
    public readonly householdCheckbox : Locator;
 // Sub-Category Checkboxes
public readonly tShirtsCheckbox : Locator;
public readonly shirtsCheckbox : Locator;
public readonly shoesCheckbox : Locator;
public readonly mobilesCheckbox : Locator;
public readonly laptopsCheckbox : Locator;

// Gender/Search For Checkboxes
public readonly menCheckbox : Locator;
public readonly womenCheckbox : Locator;

// All Product Cards
public readonly productCards : Locator;
public readonly adidasProduct  : Locator;
public readonly zaraCoatProduct : Locator;
public readonly iphoneProduct : Locator;

// Product Image
public readonly productImages  : Locator;

// Product Title
public readonly productTitles  : Locator;

// Product Price
public readonly productPrices  : Locator;

// pasgination components 
public readonly prevButton : Locator;
public readonly nextButton : Locator;
public readonly currentPage : Locator;


    constructor (page:Page)
    {
        super(page);
        this.ordersButton = page.getByRole("link", { name: /Orders/i });
        this.cartButton = page.locator("button.btn-custom:has-text('Cart')");
         this.cartCountBadge = page.locator("button[routerlink='/dashboard/cart'] label");
        this.signOutButton = page.getByRole("link", { name: /Sign Out/i });
        this.blinkingText = page.getByLabel(/Register to sign in with your personal account/i);
        this.qaCareerLink = page.locator("a.blinkingText");

        this.searchInput = page.getByPlaceholder(/Search for Products, Brands and more/i);
        this.minPriceInput = page.getByPlaceholder(/Min/i);
        this.maxPriceInput = page.getByPlaceholder(/Max/i);
        this.fashionCheckbox = page.getByLabel(/Fashion/i);
        this.electronicsCheckbox = page.getByLabel(/Electronics/i);
        this.householdCheckbox = page.getByLabel(/Household/i);
        this.tShirtsCheckbox = page.getByLabel(/T-Shirts/i);
        this.shirtsCheckbox = page.getByLabel(/Shirts/i);
        this.shoesCheckbox = page.getByLabel(/Shoes/i);
        this.mobilesCheckbox = page.getByLabel(/Mobiles/i);
        this.laptopsCheckbox = page.getByLabel(/Laptops/i);
        this.menCheckbox = page.getByLabel(/Men/i);
        this.womenCheckbox = page.getByLabel(/Women/i);
        this.productCards = page.locator("div.card"); 
        this.adidasProduct = page.locator("app-card").filter({ hasText: /adidas original/i });
        this.zaraCoatProduct = page.locator("app-card").filter({ hasText: /Zara Coat 3/i });
        this.iphoneProduct = page.locator("app-card").filter({ hasText: /iPhone 13 Pro/i });
        this.productImages = page.locator("app-card img");
        this.productTitles = page.locator("app-card h4");
        this.productPrices = page.locator("app-card h5");
        this.prevButton = page.getByRole("button", { name: /Previous/i });
        this.nextButton = page.getByRole("button", { name: /Next/i });
        this.currentPage = page.locator(".pagination .page-item.active .page-link");
    }
    override async openHomePage() :Promise<void>
    {
        await super.openHomePage();
        await this.productCards.first().waitFor(); 

    }

    //QA Career Link Click
    async clickQACareerLink(clcikElement:Locator): Promise<Page> {
await clcikElement.waitFor({state:'visible'});
  const [newTab] = await Promise.all([
    this.page.context().waitForEvent("page"),
    clcikElement.click(), 
]);
await newTab.waitForLoadState();
return newTab;
}

   async addItemToCart(productName: string): Promise<void> {
  const card = this.productCards.filter({ hasText: productName });
  await card.locator("button.w-10").first().scrollIntoViewIfNeeded();
  await card.locator("button.w-10").first().click();
}

async clickCartButton(): Promise<void> {

  await this.cartButton.waitFor({ state: "visible" });
  await this.cartButton.click();
  await this.page.waitForLoadState("networkidle");
}
}