import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/auth/login')
    WebUI.waitForElementVisible(findTestObject('Page/Auth/input_email'), 10)
    WebUI.setText(findTestObject('Page/Auth/input_email'), 'invalid@example.com')
    WebUI.setText(findTestObject('Page/Auth/input_password'), 'wrongpass')
    WebUI.click(findTestObject('Page/Auth/btn_login'))

    WebUI.waitForElementVisible(findTestObject('Page/Auth/err_invalid_credentials'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/Auth/err_invalid_credentials'), 10)
} finally {
    WebUI.closeBrowser()
}
