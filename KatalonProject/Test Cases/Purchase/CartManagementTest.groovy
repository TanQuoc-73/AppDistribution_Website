import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Cart Management
 * Verifies add, remove, and clear cart functionality
 */

// Login
WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setEncryptedText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Verify cart is initially empty or contains items
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/cart')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

WebUI.verifyElementPresent(findTestObject('CartPage/txt_cartTitle'), 10)

// Clear cart if items exist
boolean clearBtnPresent = WebUI.verifyElementPresent(findTestObject('CartPage/btn_clearCart'), 3, com.kms.katalon.core.model.FailureHandling.OPTIONAL)
if (clearBtnPresent) {
    WebUI.click(findTestObject('CartPage/btn_clearCart'))
    WebUI.delay(2)
}

// Verify empty cart state
WebUI.verifyElementPresent(findTestObject('CartPage/txt_emptyCart'), 10)

// Verify Browse Store link is present
WebUI.verifyElementPresent(findTestObject('CartPage/lnk_browseStore'), 10)

// Add a product to cart from the store
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

    // Navigate to cart and verify item was added
    WebUI.navigateToUrl(GlobalVariable.baseUrl + '/cart')
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)

    // Verify cart has items
    WebUI.verifyElementPresent(findTestObject('CartPage/txt_total'), 10)

    // Remove the item
    WebUI.click(findTestObject('CartPage/btn_removeItem'))
    WebUI.delay(2)

    // Verify empty cart after removal
    WebUI.verifyElementPresent(findTestObject('CartPage/txt_emptyCart'), 10)
}

WebUI.closeBrowser()
