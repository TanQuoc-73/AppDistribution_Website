import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'
String currentPassword = GlobalVariable.TEST_PASSWORD ?: 'password123'
String newPassword = GlobalVariable.NEW_USER_PASSWORD ?: 'newpass123'
String encNewPassword = GlobalVariable.ENCRYPTED_NEW_USER_PASSWORD ?: ''

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/dashboard/profile/change-password')
    WebUI.waitForElementVisible(findTestObject('Page/User/input_current_password'), 10)
    WebUI.setText(findTestObject('Page/User/input_current_password'), currentPassword)
    if (encNewPassword) {
        WebUI.setEncryptedText(findTestObject('Page/User/input_new_password'), encNewPassword)
    } else {
        WebUI.setText(findTestObject('Page/User/input_new_password'), newPassword)
    }
    WebUI.setText(findTestObject('Page/User/input_confirm_password'), newPassword)
    WebUI.click(findTestObject('Page/User/btn_change_password'))
    WebUI.waitForElementVisible(findTestObject('Page/User/msg_password_changed'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/User/msg_password_changed'), 10)
} finally {
    WebUI.closeBrowser()
}
