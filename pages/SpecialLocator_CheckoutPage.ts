import { Page} from "@playwright/test";


export class SpecialocatorsCheckoutPage {
 
    constructor (private page:Page){}
    private get checkoutButton(){
      return this.page.getByRole("button",{name:"CheckOut"});
    }
    async checkOut (){
      await this.checkoutButton.click();
    }
}