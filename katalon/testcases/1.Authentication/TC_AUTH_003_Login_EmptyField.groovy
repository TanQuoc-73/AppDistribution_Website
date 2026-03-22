import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/auth/login')
    WebUI.waitForElementVisible(findTestObject('Page/Auth/btn_login'), 10)
    WebUI.click(findTestObject('Page/Auth/btn_login'))
    WebUI.waitForElementVisible(findTestObject('Page/Auth/err_empty_fields'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/Auth/err_empty_fields'), 10)
} finally {
    WebUI.closeBrowser()
}
