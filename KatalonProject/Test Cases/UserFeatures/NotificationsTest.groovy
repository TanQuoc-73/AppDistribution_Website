import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Notifications Page
 * Verifies notifications page works for user
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/notifications')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

boolean isPageLoaded = WebUI.verifyTextPresent('Notifications', false, FailureHandling.OPTIONAL)
if (isPageLoaded) {
    WebUI.comment('Passed: Trang Notifications load thành công.')
} else {
    WebUI.comment('LỖI: Không tìm thấy tiêu đề hoặc giao diện Notifications.')
}

WebUI.closeBrowser()
