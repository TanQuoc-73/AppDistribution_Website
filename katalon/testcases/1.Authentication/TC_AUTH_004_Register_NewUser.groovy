import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'
String newEmail = GlobalVariable.NEW_USER_EMAIL ?: 'newuser@example.com'
String newPassword = GlobalVariable.NEW_USER_PASSWORD ?: 'newpass123'
String encNewPassword = GlobalVariable.ENCRYPTED_NEW_USER_PASSWORD ?: ''

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/auth/register')
    WebUI.waitForElementVisible(findTestObject('Page/Auth/input_email'), 10)
    WebUI.setText(findTestObject('Page/Auth/input_email'), newEmail)
    if (encNewPassword) {
        WebUI.setEncryptedText(findTestObject('Page/Auth/input_password'), encNewPassword)
    } else {
        WebUI.setText(findTestObject('Page/Auth/input_password'), newPassword)
    }
    WebUI.click(findTestObject('Page/Auth/btn_register'))

    WebUI.waitForElementVisible(findTestObject('Page/Auth/msg_register_success'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/Auth/msg_register_success'), 10)
} finally {
    WebUI.closeBrowser()
}
