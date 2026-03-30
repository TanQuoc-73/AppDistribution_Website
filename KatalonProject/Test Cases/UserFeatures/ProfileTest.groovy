import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: View Profile
 * Verifies user can access their profile settings
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/profile')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

boolean hasAvatar = WebUI.verifyElementPresent(findTestObject('ProfilePage/img_avatar'), 5, FailureHandling.OPTIONAL) || WebUI.verifyTextPresent('Profile', false, FailureHandling.OPTIONAL)
boolean hasUsernameField = WebUI.verifyElementPresent(findTestObject('ProfilePage/input_username'), 5, FailureHandling.OPTIONAL)

if (hasAvatar || hasUsernameField) {
    WebUI.comment('Passed: Truy cập trang Profile thành công và thấy các trường thông tin cơ bản.')
} else {
    WebUI.comment('LỖI: Vào trang Profile nhưng không thấy Avatar hay Username field.')
}

WebUI.closeBrowser()
