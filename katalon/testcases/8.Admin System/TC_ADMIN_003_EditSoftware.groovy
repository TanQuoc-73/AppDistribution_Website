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
    WebUI.waitForElementVisible(findTestObject('Page/Admin/software_list'), 10)
    WebUI.click(findTestObject('Page/Admin/first_software_edit'))
    WebUI.waitForElementVisible(findTestObject('Page/Admin/input_software_name'), 10)
    WebUI.setText(findTestObject('Page/Admin/input_software_name'), 'AutoTest App - Edited')
    WebUI.click(findTestObject('Page/Admin/btn_save_software'))
    WebUI.waitForElementVisible(findTestObject('Page/Admin/msg_software_updated'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/Admin/msg_software_updated'), 10)
} finally {
    WebUI.closeBrowser()
}
