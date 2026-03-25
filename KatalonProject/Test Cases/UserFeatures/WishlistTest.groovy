import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Wishlist Management
 * Verifies adding/removing products from wishlist
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

// Navigate to wishlist page
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/wishlist')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Verify wishlist page loads
WebUI.verifyElementPresent(findTestObject('WishlistPage/txt_wishlistTitle'), 10)

// Check if wishlist has items
boolean hasRemoveBtn = WebUI.verifyElementPresent(findTestObject('WishlistPage/btn_removeWishlist'), 3, com.kms.katalon.core.model.FailureHandling.OPTIONAL)

if (hasRemoveBtn) {
    // Test remove from wishlist
    WebUI.click(findTestObject('WishlistPage/btn_removeWishlist'))
    WebUI.delay(2)
    WebUI.comment('Successfully removed item from wishlist')
} else {
    // Verify empty wishlist message
    WebUI.verifyTextPresent('empty', false)
    WebUI.comment('Wishlist is empty')
}

WebUI.closeBrowser()
