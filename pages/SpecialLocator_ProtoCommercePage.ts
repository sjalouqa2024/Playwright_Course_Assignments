
import{ type Locator,type Page ,expect} from "@playwright/test";
import { SpecialLocator_basePage } from "./SpecialLocator_basePage.ts";

export class SpecialLocatorProtoCommercePage extends SpecialLocator_basePage {
public readonly Name: Locator;
public readonly Email: Locator;
public readonly password: Locator;
public readonly IceCreams: Locator;
public readonly Gender: Locator;
public readonly Student: Locator;
public readonly Employed: Locator;
public readonly Entrepreneur: Locator;
public readonly submit : Locator;
public readonly success_message: Locator;
    constructor (page:Page)
    {
        super(page);
        this.Name = page.locator('input[name="name"]').first();
        this.Email = page.locator('input[name="email"]');
        this.password = page.getByPlaceholder('Password');
        this.IceCreams = page.getByLabel('Check me out if you Love IceCreams!');
        this.Gender = page.getByRole("combobox", { name: "Gender" });
        this.Student = page.getByLabel("Student");
        this.Employed = page.getByLabel("Employed");
        this.Entrepreneur = page.getByLabel("Entrepreneur (disabled)");
        this.submit = page.getByRole('button', { name: /submit/i });
        this.success_message = page.getByText("Success! The Form has been submitted successfully!.");
    }
    override async openHomePage() :Promise<void>
    {
        await super.openHomePage();
            await expect(this.Name).toBeVisible();

    }
async submitData():Promise<void>{
    await this.Name.fill("user1");
    await this.Email.fill("user1@email.com");
    await this.password.fill("P@ssw0rd@123");
    await this.IceCreams.check();
    await this.Gender.selectOption("Female");
    await this.Employed.check();
    await this.submit.click();
}
}