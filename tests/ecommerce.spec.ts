import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { TEST_DATA } from '../utils/testdata';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('End to end ecommerce flow',()=>{
    test('Login add products and verify cart and checkout',async({page})=>{
        const login = new LoginPage(page);
        const home = new HomePage(page);
        const product = new ProductPage(page);
         const cart = new CartPage(page);
         const checkout = new CheckoutPage(page);

        await home.goto('/');

        await home.goToLogin();
        await login.login(TEST_DATA.user.email, TEST_DATA.user.password);

        for (const p of TEST_DATA.productsToAdd) {
      // Search and add (keeps flow robust versus product placement)
      await home.searchProduct(p.name);
      const productTile = home.productLocatorByName(p.name);
      if (await productTile.count() === 0) {
        throw new Error(`Product "${p.name}" not found in search results.`);
      }
      await product.addToCartFromSearchResult(p.name);
    }

     await cart.openCart();
    const count = await cart.getCartCount();
    if (count < TEST_DATA.productsToAdd.length) {
      throw new Error(`Cart count mismatch: expected at least ${TEST_DATA.productsToAdd.length} but found ${count}`);
    }
    for (const p of TEST_DATA.productsToAdd) {
      await cart.verifyProductPresent(p.name);
    }

    await cart.agreeToTerms();
    await cart.proceedToCheckout();
    //await checkout.fillBillingAddress(TEST_DATA.billing);
    await checkout.completeRemainingSteps();
    await checkout.assertOrderSuccess();

    })
})