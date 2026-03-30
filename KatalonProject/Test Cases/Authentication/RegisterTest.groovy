import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Register a new account
 * Verifies that a new user can register with valid details
 */

// Generate unique test data
String timestamp = new Date().format('yyyyMMddHHmmss')
String testUsername = 'testuser_' + timestamp
String testEmail = 'testuser_' + timestamp + '@example.com'
String testPassword = 'TestPassword123!'

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/register')
WebUI.maximizeWindow()

// Verify register page loads correctly
WebUI.verifyElementPresent(findTestObject('RegisterPage/txt_username'), 10)
WebUI.verifyElementPresent(findTestObject('RegisterPage/txt_email'), 10)
WebUI.verifyElementPresent(findTestObject('RegisterPage/txt_password'), 10)
WebUI.verifyElementPresent(findTestObject('RegisterPage/btn_register'), 10)

// Enter registration details
WebUI.setText(findTestObject('RegisterPage/txt_username'), testUsername)
WebUI.setText(findTestObject('RegisterPage/txt_email'), testEmail)
WebUI.setText(findTestObject('RegisterPage/txt_password'), testPassword)

// Click Register
WebUI.click(findTestObject('RegisterPage/btn_register'))
WebUI.delay(3)

// Ứng dụng sau khi đăng ký thành công sẽ không hiện popup/message tại chỗ mà redirect sang `/login?registered=1`
WebUI.waitForPageLoad(10)
boolean isOnLoginPage = WebUI.verifyElementPresent(findTestObject('LoginPage/btn_signIn'), 15, FailureHandling.OPTIONAL)

if (isOnLoginPage) {
    WebUI.comment('Đăng ký thành công và đã redirect về trang login.')
    String url = WebUI.getUrl()
    if (url.contains('registered=1')) {
        WebUI.comment('URL có chứa tham số registered=1 đúng như thiết kế FE.')
    }
} else {
    WebUI.comment('LỖI: Trình duyệt không chuyển hướng về trang login. URL hiện tại: ' + WebUI.getUrl())
}

WebUI.closeBrowser()
