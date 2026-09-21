 
 import { Page, Locator } from "@playwright/test";
import { CodeGenBasePage } from "./CodeGen_basePage";
 
 export class CodeGen_paymentPage extends CodeGenBasePage {
    public readonly productImage: Locator;
    public readonly productTitle: Locator;
    public readonly productPrice: Locator;
    public readonly productQuantity: Locator;
    public readonly creditCardNumber: Locator;
    public readonly nameOnCardInput: Locator;
    public readonly emailInput: Locator;
    public readonly cvvInput: Locator;
    public readonly expiryMonthDropdown: Locator;
    public readonly expiryYearDropdown: Locator;
    public readonly countryInput: Locator;
    public readonly couponInput: Locator;  // ✅ INPUT only
    public readonly applyCouponButton: Locator;  // ✅ BUTTON only
    public readonly placeOrderButton: Locator;

    constructor(page: Page) {
    super(page);

    // Order Information
    this.productImage = page.locator(".details__item img.iphone");
    this.productTitle = page.locator(".item__title");
    this.productPrice = page.locator(".item__price");
    this.productQuantity = page.locator(".item__quantity");

    // Credit Card - scope to field
    this.creditCardNumber = page.locator("div.field").filter({ hasText: "Credit Card Number" }).locator("input[type='text']");
    
    // ✅ NEW - Expiry selects in form, more reliable
    const form = page.locator("div.form__cc");
    this.expiryMonthDropdown = form.locator("select.input.ddl").nth(0);  // First select
    this.expiryYearDropdown = form.locator("select.input.ddl").nth(1);   // Second select

    // CVV - scope to field
    this.cvvInput = page.locator("div.field").filter({ hasText: "CVV Code" }).locator("input[type='text']");

    // Name on Card - scope to field
    this.nameOnCardInput = page.locator("div.field").filter({ hasText: "Name on Card" }).locator("input[type='text']");

    // Coupon INPUT and BUTTON
    this.couponInput = page.locator('input[name="coupon"]');
    this.applyCouponButton = page.locator('button[type="submit"].btn-primary');

    // Country
    this.countryInput = page.locator("input[placeholder='Select Country']");

    // Email
    this.emailInput = page.locator(".user__name input.input.txt");

    // Place Order
    this.placeOrderButton = page.locator("a.btnn.action__submit");
}

    async fillPayementDetails(
        creditCardNumber: string,
        expiryMonth: string,
        expiryYear: string,
        cvvCode: string,
        nameOnCard: string,
        applyCoupon: string,
        selectCountry: string
    ): Promise<void> {
        // Credit Card
        await this.creditCardNumber.scrollIntoViewIfNeeded();
        await this.creditCardNumber.waitFor({ state: "visible" });
        await this.creditCardNumber.fill(creditCardNumber);

        // Expiry Month
       
        await this.expiryMonthDropdown.selectOption(expiryMonth);

        // Expiry Year
        
        await this.expiryYearDropdown.selectOption(expiryYear);

        // CVV
   
        await this.cvvInput.fill(cvvCode);

        // Name on Card

        await this.nameOnCardInput.fill(nameOnCard);

        // Coupon INPUT (just fill it)
        if (applyCoupon) {
            await this.couponInput.scrollIntoViewIfNeeded();
            await this.couponInput.waitFor({ state: "visible" });
            await this.couponInput.fill(applyCoupon);

            // Click the BUTTON separately
            await this.applyCouponButton.scrollIntoViewIfNeeded();
            await this.applyCouponButton.click();
        }
      }
    }