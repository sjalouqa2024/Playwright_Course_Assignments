import{ type Page,Locator} from "@playwright/test";

export class CodeGenBasePage
{
    public readonly registerLink:Locator;
    constructor(readonly page:Page){
    this.registerLink = page.locator("a.text-reset");    }
    //open home page
    async openHomePage():Promise<void>
        {
              await this.page.goto("https://rahulshettyacademy.com/client");
          }
    async openRegisterLink(): Promise<void> 
    {
        await this.registerLink.click();
    }
}


