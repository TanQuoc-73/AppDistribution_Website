import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Add to Cart
 * Verifies the add to cart functionality from product detail page
 */

// Login first
WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Verify logged in
WebUI.verifyElementPresent(findTestObject('Header/lnk_profile'), 10)

// Navigate to store
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Click on first product
WebUI.click(findTestObject('StorePage/card_firstProduct'))
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Try to add to cart (if not already purchased)
boolean addToCartPresent = WebUI.verifyElementPresent(findTestObject('ProductPage/btn_addToCart'), 3, com.kms.katalon.core.model.FailureHandling.OPTIONAL)

if (addToCartPresent) {
    WebUI.click(findTestObject('ProductPage/btn_addToCart'))
    WebUI.delay(3)

    // Navigate to cart to verify item was added
    WebUI.navigateToUrl(GlobalVariable.baseUrl + '/cart')
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)

    // Verify cart is not empty
    WebUI.verifyElementPresent(findTestObject('CartPage/txt_cartTitle'), 10)

    // Verify at least one item present (total should be visible)
    WebUI.verifyElementPresent(findTestObject('CartPage/txt_total'), 10)

    // Clean up: remove item from cart
    WebUI.click(findTestObject('CartPage/btn_removeItem'))
    WebUI.delay(2)
}

WebUI.closeBrowser()
