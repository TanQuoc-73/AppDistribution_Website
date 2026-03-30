import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Search Products
 * Verifies the store search functionality works correctly
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.maximizeWindow()
WebUI.waitForPageLoad(10)

// Verify store page loads
WebUI.verifyElementPresent(findTestObject('StorePage/txt_storeTitle'), 10)

// Test 1: Search with a valid keyword
WebUI.setText(findTestObject('StorePage/txt_search'), 'Aurora')
WebUI.click(findTestObject('StorePage/btn_search'))
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Verify results appear (product grid should be visible)
WebUI.verifyElementPresent(findTestObject('StorePage/div_productGrid'), 10)

// Test 2: Search with empty string to reset
WebUI.clearText(findTestObject('StorePage/txt_search'))
WebUI.click(findTestObject('StorePage/btn_search'))
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Verify products are shown
WebUI.verifyElementPresent(findTestObject('StorePage/div_productGrid'), 10)

// Test 3: Search with a term that returns no results
WebUI.setText(findTestObject('StorePage/txt_search'), 'xyznonexistent12345')
WebUI.sendKeys(findTestObject('StorePage/txt_search'), org.openqa.selenium.Keys.ENTER.toString())
WebUI.waitForPageLoad(10)
WebUI.delay(3)

// Verify "No apps found" or empty state
WebUI.verifyTextPresent('No apps found', false, com.kms.katalon.core.model.FailureHandling.OPTIONAL)

// Test 4: Search from header search bar (desktop)
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/')
WebUI.waitForPageLoad(10)

boolean headerSearchPresent = WebUI.verifyElementPresent(findTestObject('Header/txt_searchHeader'), 3, com.kms.katalon.core.model.FailureHandling.OPTIONAL)
if (headerSearchPresent) {
    WebUI.setText(findTestObject('Header/txt_searchHeader'), 'game')
    WebUI.sendKeys(findTestObject('Header/txt_searchHeader'), org.openqa.selenium.Keys.ENTER.toString())
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)

    // Verify redirected to store with search results
    String currentUrl = WebUI.getUrl()
    assert currentUrl.contains('/store') || currentUrl.contains('/search') : 'Header search did not redirect to store/search page'
}

WebUI.closeBrowser()
