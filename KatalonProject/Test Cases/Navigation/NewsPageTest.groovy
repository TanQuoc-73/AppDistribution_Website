import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: News Page
 * Verifies news listing and article detail pages
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/news')
WebUI.maximizeWindow()
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Verify news page loads
WebUI.verifyElementPresent(findTestObject('NewsPage/txt_newsTitle'), 10)

// Check if news articles exist
boolean hasReadMore = WebUI.verifyElementPresent(findTestObject('NewsPage/lnk_readMore'), 5, com.kms.katalon.core.model.FailureHandling.OPTIONAL)

if (hasReadMore) {
    // Click first Read More link
    WebUI.click(findTestObject('NewsPage/lnk_readMore'))
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)

    // Verify navigated to article detail
    String articleUrl = WebUI.getUrl()
    assert articleUrl.contains('/news/') : 'Did not navigate to article detail page'

    // Go back to news listing
    WebUI.back()
    WebUI.waitForPageLoad(10)
    WebUI.delay(1)
    WebUI.verifyElementPresent(findTestObject('NewsPage/txt_newsTitle'), 10)
} else {
    WebUI.comment('No news articles found')
}

// Test: Navigate to news from header
WebUI.navigateToUrl(GlobalVariable.baseUrl)
WebUI.waitForPageLoad(5)
WebUI.click(findTestObject('Header/lnk_news'))
WebUI.waitForPageLoad(10)
WebUI.delay(1)

WebUI.verifyElementPresent(findTestObject('NewsPage/txt_newsTitle'), 10)

WebUI.closeBrowser()
