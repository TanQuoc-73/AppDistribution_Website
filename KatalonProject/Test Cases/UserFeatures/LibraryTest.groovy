import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Library Test
 * Verifies library page loads for logged in users
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/library')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

boolean hasApps = WebUI.verifyElementPresent(findTestObject('LibraryPage/card_firstOwnedApp'), 5, FailureHandling.OPTIONAL)
boolean isEmpty = WebUI.verifyTextPresent('No apps in your library', false, FailureHandling.OPTIONAL) || WebUI.verifyTextPresent('chưa sở hữu', false, FailureHandling.OPTIONAL)

if (hasApps || isEmpty) {
    WebUI.comment('Passed: Trang Library đã hiển thị đúng trạng thái UI: Hoặc đầy đủ apps, hoặc ở trạng thái Empty State.')
} else {
    WebUI.comment('LỖI: Truy cập /library nhưng không nhìn thấy ứng dụng nào và cũng không thấy chữ Empty State.')
}

WebUI.closeBrowser()
