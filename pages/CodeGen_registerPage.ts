import { Page, Locator } from "@playwright/test";
import { CodeGenBasePage } from "./CodeGen_basePage";

export class CodeGen_registerPage extends CodeGenBasePage {
    
    public readonly registerLabel: Locator;
    public readonly firstName: Locator;
    public readonly lastName: Locator;
    public readonly email: Locator; 
    public readonly phoneNumber: Locator;
    public readonly occupation: Locator;
    public readonly maleOption: Locator;
    public readonly femaleOption: Locator;
    public readonly password: Locator;
    public readonly confirmPassword: Locator;
    public readonly agreeCheckbox: Locator; 
    public readonly registerButton: Locator;
    public readonly loginLink: Locator;

    constructor (page:Page)
    {
        super(page);
        this.registerLabel = page.getByRole("heading", { name: "Register" });
        this.firstName = page.getByPlaceholder("First Name");
        this.lastName = page.getByPlaceholder("Last Name");
        this.email = page.getByPlaceholder("email@example.com");
        this.phoneNumber = page.getByPlaceholder("enter your number");
        this.occupation = page.locator("select[formcontrolname='occupation']");
        this.maleOption = page.getByLabel("Male");
        this.femaleOption = page.getByLabel("Female");
        this.password = page.locator("input[formcontrolname='userPassword']");
        this.confirmPassword = page.locator("input[formcontrolname='confirmPassword']");
        this.agreeCheckbox = page.locator("input[formcontrolname='required']");
        this.registerButton = page.locator("input[type='submit'][value='Register']");
        this.loginLink = page.locator("a:has-text('Login here')");    }
    override async openHomePage() :Promise<void>
    {
        await super.openHomePage();
        await super.openRegisterLink();
        await this.page.waitForLoadState("networkidle"); 
    }
   async registerUser(
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  occupation: string,
  gender: string,
  password: string,
  confirmPassword: string  
): Promise<{ email: string; password: string }> {
  await this.firstName.fill(firstName);
  await this.lastName.fill(lastName);
  await this.email.fill(email);
  await this.phoneNumber.fill(phoneNumber);
  await this.occupation.waitFor();
  await this.occupation.selectOption(occupation);
  
  // check the gender option based on the provided gender
  if (gender.toLowerCase() === "male") {
    await this.maleOption.check();
  } else if (gender.toLowerCase() === "female") {
    await this.femaleOption.check();
  }
  await this.password.waitFor(); 
  await this.password.fill(password);
  await this.confirmPassword.fill(confirmPassword);
  await this.agreeCheckbox.check();
  await this.registerButton.click();
  await this.page.waitForLoadState("networkidle");  
return {email , password};
}
}