import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Payment Methods Validation
 * Verifies all payment method options are available during checkout
 */

// Login
WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Add a product to cart
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

WebUI.click(findTestObject('StorePage/card_firstProduct'))
WebUI.waitForPageLoad(10)
WebUI.delay(2)

boolean addToCartPresent = WebUI.verifyElementPresent(findTestObject('ProductPage/btn_addToCart'), 3, com.kms.katalon.core.model.FailureHandling.OPTIONAL)

if (addToCartPresent) {
    WebUI.click(findTestObject('ProductPage/btn_addToCart'))
    WebUI.delay(3)

    // Go to checkout
    WebUI.navigateToUrl(GlobalVariable.baseUrl + '/cart')
    WebUI.waitForPageLoad(10)
    WebUI.click(findTestObject('CartPage/btn_checkout'))
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)

    // Verify all 4 payment methods are present
    WebUI.verifyElementPresent(findTestObject('CheckoutPage/btn_creditCard'), 10)
    WebUI.verifyElementPresent(findTestObject('CheckoutPage/btn_bankTransfer'), 10)
    WebUI.verifyElementPresent(findTestObject('CheckoutPage/btn_paypal'), 10)
    WebUI.verifyElementPresent(findTestObject('CheckoutPage/btn_ewallet'), 10)

    // Test selecting each payment method
    WebUI.click(findTestObject('CheckoutPage/btn_creditCard'))
    WebUI.delay(1)
    WebUI.comment('Credit Card payment method selected')

    WebUI.click(findTestObject('CheckoutPage/btn_bankTransfer'))
    WebUI.delay(1)
    WebUI.comment('Bank Transfer payment method selected')

    WebUI.click(findTestObject('CheckoutPage/btn_paypal'))
    WebUI.delay(1)
    WebUI.comment('PayPal payment method selected')

    WebUI.click(findTestObject('CheckoutPage/btn_ewallet'))
    WebUI.delay(1)
    WebUI.comment('E-Wallet payment method selected')

    // Verify Place Order button is present
    WebUI.verifyElementPresent(findTestObject('CheckoutPage/btn_placeOrder'), 10)

    // Clean up: go back and clear cart
    WebUI.navigateToUrl(GlobalVariable.baseUrl + '/cart')
    WebUI.waitForPageLoad(5)
    WebUI.click(findTestObject('CartPage/btn_clearCart'))
    WebUI.delay(2)
}

WebUI.closeBrowser()
