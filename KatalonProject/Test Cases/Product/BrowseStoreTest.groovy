import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Browse Store with Filters
 * Verifies store filtering and sorting functionality
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.maximizeWindow()
WebUI.waitForPageLoad(10)

// Verify store page loads with product grid
WebUI.verifyElementPresent(findTestObject('StorePage/txt_storeTitle'), 10)
WebUI.verifyElementPresent(findTestObject('StorePage/div_productGrid'), 15)

// Test sorting by Newest
boolean sortPresent = WebUI.verifyElementPresent(findTestObject('StorePage/dd_sort'), 3, com.kms.katalon.core.model.FailureHandling.OPTIONAL)
if (sortPresent) {
    WebUI.selectOptionByLabel(findTestObject('StorePage/dd_sort'), 'Newest', false)
    WebUI.delay(2)
    WebUI.verifyElementPresent(findTestObject('StorePage/div_productGrid'), 10)
}

// Navigate to store with category filter via URL
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store?sort=popular')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Verify results load
WebUI.verifyElementPresent(findTestObject('StorePage/div_productGrid'), 10)

// Navigate with price sort
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store?sort=price_asc')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

WebUI.verifyElementPresent(findTestObject('StorePage/div_productGrid'), 10)

// Test pagination (if exists)
boolean nextPagePresent = WebUI.verifyElementPresent(findTestObject('StorePage/btn_nextPage'), 3, com.kms.katalon.core.model.FailureHandling.OPTIONAL)
if (nextPagePresent) {
    WebUI.click(findTestObject('StorePage/btn_nextPage'))
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)
    WebUI.verifyElementPresent(findTestObject('StorePage/div_productGrid'), 10)
}

WebUI.closeBrowser()
