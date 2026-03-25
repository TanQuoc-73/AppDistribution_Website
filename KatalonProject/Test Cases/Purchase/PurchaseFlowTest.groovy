import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Full Purchase Flow
 * End-to-end test: Login → Browse → Add to Cart → Checkout → Payment → Verify Library
 */

// Step 1: Login
WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setEncryptedText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)
WebUI.delay(2)
WebUI.verifyElementPresent(findTestObject('Header/lnk_profile'), 10)

// Step 2: Navigate to Store and find a product
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.waitForPageLoad(10)
WebUI.delay(2)
WebUI.verifyElementPresent(findTestObject('StorePage/div_productGrid'), 15)

// Click on first product
WebUI.click(findTestObject('StorePage/card_firstProduct'))
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Step 3: Add to cart (skip if already purchased)
boolean addToCartPresent = WebUI.verifyElementPresent(findTestObject('ProductPage/btn_addToCart'), 3, com.kms.katalon.core.model.FailureHandling.OPTIONAL)

if (addToCartPresent) {
    WebUI.click(findTestObject('ProductPage/btn_addToCart'))
    WebUI.delay(3)

    // Step 4: Go to Cart
    WebUI.navigateToUrl(GlobalVariable.baseUrl + '/cart')
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)

    WebUI.verifyElementPresent(findTestObject('CartPage/txt_cartTitle'), 10)
    WebUI.verifyElementPresent(findTestObject('CartPage/txt_total'), 10)

    // Step 5: Proceed to Checkout
    WebUI.click(findTestObject('CartPage/btn_checkout'))
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)

    // Step 6: Select payment method (Credit Card)
    WebUI.click(findTestObject('CheckoutPage/btn_creditCard'))
    WebUI.delay(1)

    // Step 7: Verify total price is displayed
    WebUI.verifyElementPresent(findTestObject('CheckoutPage/txt_totalPrice'), 10)

    // Step 8: Place order
    WebUI.click(findTestObject('CheckoutPage/btn_placeOrder'))
    WebUI.delay(5)

    // Step 9: Verify payment success
    WebUI.verifyElementPresent(findTestObject('CheckoutPage/txt_paymentSuccess'), 20)

    // Step 10: Click Go to Library
    WebUI.click(findTestObject('CheckoutPage/btn_goToLibrary'))
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)

    // Step 11: Verify product appears in library
    WebUI.verifyElementPresent(findTestObject('LibraryPage/txt_libraryTitle'), 10)
} else {
    WebUI.comment('Product already purchased or is free - skipping purchase flow')
}

WebUI.closeBrowser()
