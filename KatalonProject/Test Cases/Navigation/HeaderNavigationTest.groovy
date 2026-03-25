import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Header Navigation
 * Verifies all header navigation links work correctly
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl)
WebUI.maximizeWindow()
WebUI.waitForPageLoad(10)

// Verify header elements for unauthenticated user
WebUI.verifyElementPresent(findTestObject('Header/lnk_logo'), 10)
WebUI.verifyElementPresent(findTestObject('Header/lnk_store'), 10)
WebUI.verifyElementPresent(findTestObject('Header/lnk_news'), 10)
WebUI.verifyElementPresent(findTestObject('Header/lnk_signIn'), 10)
WebUI.verifyElementPresent(findTestObject('Header/btn_register'), 10)

// Test: Click Store link
WebUI.click(findTestObject('Header/lnk_store'))
WebUI.waitForPageLoad(10)
WebUI.delay(1)
String storeUrl = WebUI.getUrl()
assert storeUrl.contains('/store') : 'Store link did not navigate to store page'

// Test: Click News link
WebUI.click(findTestObject('Header/lnk_news'))
WebUI.waitForPageLoad(10)
WebUI.delay(1)
String newsUrl = WebUI.getUrl()
assert newsUrl.contains('/news') : 'News link did not navigate to news page'

// Test: Click Logo to go home
WebUI.click(findTestObject('Header/lnk_logo'))
WebUI.waitForPageLoad(10)
WebUI.delay(1)

// Test: Click Sign In link
WebUI.click(findTestObject('Header/lnk_signIn'))
WebUI.waitForPageLoad(10)
WebUI.delay(1)
String loginUrl = WebUI.getUrl()
assert loginUrl.contains('/login') : 'Sign In link did not navigate to login page'

// Test: Click Register button
WebUI.navigateToUrl(GlobalVariable.baseUrl)
WebUI.waitForPageLoad(5)
WebUI.click(findTestObject('Header/btn_register'))
WebUI.waitForPageLoad(10)
WebUI.delay(1)
String registerUrl = WebUI.getUrl()
assert registerUrl.contains('/register') : 'Register button did not navigate to register page'

WebUI.closeBrowser()
