import { Page} from "@playwright/test";

export class SpecialocatorsDeliveryPage  {

    constructor (private page:Page){}
private get Country()
{
  return this.page.locator("#country");
}

private Suggestions(CountryName:string)
{
  return this.page.locator('.suggestions').filter({hasText:CountryName});
}

private get TermsConditions()
{
  return this.page.locator('#checkbox2');
}

private get PurchaseButton()
{
  return this.page.getByRole('button', { name: 'Purchase' });
}

 async SelectCountry(partial:string,countryFullName:string)
 {
  await this.Country.pressSequentially(partial,{delay:100});
  await this.Suggestions(countryFullName).click();
 }
 async agreeToTerms()
 {
await this.TermsConditions.check({force:true});
 }
async purchase(){
  await this.PurchaseButton.click();
}
}

