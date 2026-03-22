import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'
String testEmail = GlobalVariable.TEST_EMAIL ?: 'test@example.com'
String testPassword = GlobalVariable.TEST_PASSWORD ?: 'password123'
String encPassword = GlobalVariable.ENCRYPTED_TEST_PASSWORD ?: ''

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/auth/login')
    WebUI.waitForElementVisible(findTestObject('Page/Auth/input_email'), 10)
    WebUI.setText(findTestObject('Page/Auth/input_email'), testEmail)
    if (encPassword) {
        WebUI.setEncryptedText(findTestObject('Page/Auth/input_password'), encPassword)
    } else {
        WebUI.setText(findTestObject('Page/Auth/input_password'), testPassword)
    }
    WebUI.click(findTestObject('Page/Auth/btn_login'))

    WebUI.waitForElementVisible(findTestObject('Page/Library/h1_MyLibrary'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/Library/h1_MyLibrary'), 10)
} finally {
    WebUI.closeBrowser()
}
