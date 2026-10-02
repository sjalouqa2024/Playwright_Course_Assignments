import{ type Page} from "@playwright/test";

export class SpecialLocator_basePage
{
    constructor(readonly page:Page){
    }
    // ProtoCommerce Page
    async openHomePage():Promise<void>
        {
              await this.page.goto("https://rahulshettyacademy.com/angularpractice/");
        }
      }


