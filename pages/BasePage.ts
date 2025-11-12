import { Page } from '@playwright/test';

export class BasePage{
    readonly page:Page;
    constructor(page:Page){
        this.page=page;
    }

    async goto(path='/'){
        await this.page.goto(path);
        await this.page.waitForLoadState('domcontentloaded')
    }

    async click(locator:string){
        await this.page.locator(locator).waitFor({state:'visible'});
        await this.page.locator(locator).click();
    }

    locator(selector:string){
        return this.page.locator(selector)
    }
}