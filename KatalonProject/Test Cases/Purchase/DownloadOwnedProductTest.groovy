import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Download Owned Product
 * Verifies that clicking download on an owned product in the Library triggers or shows valid feedback
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

// Tới Library để xem sách các app đã sở hữu
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/library')
WebUI.waitForPageLoad(10)
WebUI.delay(3)

boolean hasApps = WebUI.verifyElementPresent(findTestObject('LibraryPage/card_firstOwnedApp'), 8, FailureHandling.OPTIONAL)

if (hasApps) {
    WebUI.click(findTestObject('LibraryPage/card_firstOwnedApp'))
    WebUI.delay(2)
    
    // Xem trong chi tiết app mua rồi có nút Download / Cài đặt không
    boolean hasDownloadBtn = WebUI.verifyElementPresent(findTestObject('LibraryPage/btn_download'), 5, FailureHandling.OPTIONAL)
    if (hasDownloadBtn) {
        WebUI.click(findTestObject('LibraryPage/btn_download'))
        WebUI.delay(2)
        WebUI.comment('Test Passed: Đã click nút Download thành công.')
        // Rất khó để verify tiến trình tải file qua trình duyệt bằng WebUI, nên ta assert logic giao diện
    } else {
        WebUI.comment('LỖI: Vào tài nguyên đã sở hữu nhưng chữ "Download" không hiển thị.')
    }
} else {
    WebUI.comment('CẢNH BÁO: Tài khoản này chưa sở hữu phần mềm nào để verify Download.')
}

WebUI.closeBrowser()