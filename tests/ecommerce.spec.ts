import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { TEST_DATA } from '../utils/testdata';

test.describe('End to end ecommerce flow',()=>{
    test('Login add products and verify cart and checkout',async({page})=>{
        const login = new LoginPage(page);
        const home = new HomePage(page);


        await home.goto('/');

        await home.goToLogin();
        await login.login(TEST_DATA.user.email, TEST_DATA.user.password);
    })
})