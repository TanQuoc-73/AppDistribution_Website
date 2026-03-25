import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Home Page Sections
 * Verifies all sections of the home page render correctly
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl)
WebUI.maximizeWindow()
WebUI.waitForPageLoad(10)
WebUI.delay(3)

// Verify Hero Carousel section
WebUI.verifyElementPresent(findTestObject('HomePage/div_heroCarousel'), 15)

// Verify Featured Apps section
WebUI.scrollToElement(findTestObject('HomePage/txt_featuredApps'), 5)
WebUI.verifyElementPresent(findTestObject('HomePage/txt_featuredApps'), 10)

// Verify See All link
WebUI.verifyElementPresent(findTestObject('HomePage/lnk_seeAll'), 10)

// Verify Categories section
WebUI.scrollToElement(findTestObject('HomePage/txt_categories'), 5)
WebUI.verifyElementPresent(findTestObject('HomePage/txt_categories'), 10)

// Verify Trending section
WebUI.scrollToElement(findTestObject('HomePage/txt_trending'), 5)
WebUI.verifyElementPresent(findTestObject('HomePage/txt_trending'), 10)

// Verify News section
WebUI.scrollToElement(findTestObject('HomePage/txt_newsSection'), 5)
WebUI.verifyElementPresent(findTestObject('HomePage/txt_newsSection'), 10)

// Test: Click See All link navigates to store
WebUI.scrollToElement(findTestObject('HomePage/lnk_seeAll'), 5)
WebUI.click(findTestObject('HomePage/lnk_seeAll'))
WebUI.waitForPageLoad(10)
WebUI.delay(1)
String currentUrl = WebUI.getUrl()
assert currentUrl.contains('/store') : 'See All link did not navigate to store page'

WebUI.closeBrowser()
