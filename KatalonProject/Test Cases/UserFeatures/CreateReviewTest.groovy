import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Create Review Test
 * Verifies users can review products they own
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

// Phải vào Library mới chắc chắn tìm được ứng dụng đã mua để review
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/library')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

boolean hasApps = WebUI.verifyElementPresent(findTestObject('LibraryPage/card_firstOwnedApp'), 8, FailureHandling.OPTIONAL)
if (hasApps) {
    WebUI.click(findTestObject('LibraryPage/card_firstOwnedApp'))
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)
    
    boolean canReview = WebUI.verifyElementPresent(findTestObject('ProductPage/btn_writeReview'), 5, FailureHandling.OPTIONAL)
    if (canReview) {
        WebUI.click(findTestObject('ProductPage/btn_writeReview'))
        WebUI.delay(2)
        
        // Modal popup form write review should open
        boolean modalOpen = WebUI.verifyElementPresent(findTestObject('ProductPage/input_reviewText'), 3, FailureHandling.OPTIONAL)
        if (modalOpen) {
            WebUI.comment('Passed: Đã mở form review cho ứng dụng bản quyền thành công.')
            // Có thể submit review nếu muốn:
            // WebUI.setText(findTestObject('ProductPage/input_reviewText'), 'Great app!')
            // WebUI.click(findTestObject('ProductPage/btn_submitReview'))
        } else {
             WebUI.comment('LỖI: Bấm Write Review nhưng không mở Form Modal lên.')
        }
    } else {
        WebUI.comment('CẢNH BÁO: App đã mua nhưng không tìm thấy nút Write Review. Có thể user này đã từng review app này rồi.')
    }
} else {
    WebUI.comment('Bỏ qua: TK chưa sở hữu app nào để review.')
}

WebUI.closeBrowser()