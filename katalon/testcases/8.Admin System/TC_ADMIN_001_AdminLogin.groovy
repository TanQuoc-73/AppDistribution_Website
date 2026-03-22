import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/admin/login')
    WebUI.waitForElementVisible(findTestObject('Page/Admin/input_username'), 10)
    WebUI.setText(findTestObject('Page/Admin/input_username'), GlobalVariable.ADMIN_USER ?: 'admin')
    WebUI.setEncryptedText(findTestObject('Page/Admin/input_password'), GlobalVariable.ENCRYPTED_ADMIN_PASSWORD ?: '')
    WebUI.click(findTestObject('Page/Admin/btn_login'))
    WebUI.waitForElementVisible(findTestObject('Page/Admin/dashboard_home'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/Admin/dashboard_home'), 10)
} finally {
    WebUI.closeBrowser()
}
