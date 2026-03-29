import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Purchase with Coupon
 * Verifies that a coupon code can be applied during checkout
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

// Navigate to store and add product to cart
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

    // Go to cart and checkout
    WebUI.navigateToUrl(GlobalVariable.baseUrl + '/cart')
    WebUI.waitForPageLoad(10)
    WebUI.click(findTestObject('CartPage/btn_checkout'))
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)

    // Select payment method
    WebUI.click(findTestObject('CheckoutPage/btn_creditCard'))
    WebUI.delay(1)

    // Apply a valid coupon code
    WebUI.setText(findTestObject('CheckoutPage/txt_couponCode'), GlobalVariable.validCouponCode)
    WebUI.click(findTestObject('CheckoutPage/btn_applyCoupon'))
    WebUI.delay(2)

    // Verify discount is applied (total should change)
    WebUI.verifyElementPresent(findTestObject('CheckoutPage/txt_totalPrice'), 10)

    // Test: Apply invalid coupon
    WebUI.clearText(findTestObject('CheckoutPage/txt_couponCode'))
    WebUI.setText(findTestObject('CheckoutPage/txt_couponCode'), 'INVALID_COUPON_XYZ')
    WebUI.click(findTestObject('CheckoutPage/btn_applyCoupon'))
    WebUI.delay(2)

    // Verify error message for invalid coupon
    WebUI.verifyElementPresent(findTestObject('CheckoutPage/txt_errorMessage'), 5)

    // Clean up cart
    WebUI.navigateToUrl(GlobalVariable.baseUrl + '/cart')
    WebUI.waitForPageLoad(5)
    WebUI.click(findTestObject('CartPage/btn_clearCart'))
    WebUI.delay(2)
}

WebUI.closeBrowser()
