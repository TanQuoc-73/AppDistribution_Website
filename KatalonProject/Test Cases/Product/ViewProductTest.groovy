import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: View Product Detail
 * Verifies product detail page displays all required information
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.maximizeWindow()
WebUI.waitForPageLoad(10)

// Verify store page loads
WebUI.verifyElementPresent(findTestObject('StorePage/txt_storeTitle'), 10)
WebUI.verifyElementPresent(findTestObject('StorePage/div_productGrid'), 15)

// Click on the first product card
WebUI.click(findTestObject('StorePage/card_firstProduct'))
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Verify product detail page elements
WebUI.verifyElementPresent(findTestObject('ProductPage/txt_productTitle'), 10)
WebUI.verifyElementPresent(findTestObject('ProductPage/txt_developerName'), 10)
WebUI.verifyElementPresent(findTestObject('ProductPage/img_mainImage'), 10)
WebUI.verifyElementPresent(findTestObject('ProductPage/txt_description'), 10)

// Verify price section is present
WebUI.verifyElementPresent(findTestObject('ProductPage/txt_price'), 10)

// Verify Add to Cart or Get Free button is present
boolean hasAddToCart = WebUI.verifyElementPresent(findTestObject('ProductPage/btn_addToCart'), 3, com.kms.katalon.core.model.FailureHandling.OPTIONAL)
boolean hasFreeButton = WebUI.verifyElementPresent(findTestObject('ProductPage/btn_getFree'), 3, com.kms.katalon.core.model.FailureHandling.OPTIONAL)
boolean hasPurchased = WebUI.verifyElementPresent(findTestObject('ProductPage/btn_purchased'), 3, com.kms.katalon.core.model.FailureHandling.OPTIONAL)

// At least one action button should be present
assert hasAddToCart || hasFreeButton || hasPurchased : 'No action button found on product page'

WebUI.closeBrowser()
