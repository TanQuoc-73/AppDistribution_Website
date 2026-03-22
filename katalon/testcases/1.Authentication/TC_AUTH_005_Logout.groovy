import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl)
    // Ensure user logged in first (caller can log in via separate step or Test Suite)
    WebUI.waitForElementVisible(findTestObject('Page/Common/btn_logout'), 10)
    WebUI.click(findTestObject('Page/Common/btn_logout'))
    WebUI.waitForElementVisible(findTestObject('Page/Auth/btn_login'), 10)
    WebUI.navigateToUrl(baseUrl + '/library')
    WebUI.waitForElementVisible(findTestObject('Page/Auth/btn_login'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/Auth/btn_login'), 10)
} finally {
    WebUI.closeBrowser()
}
