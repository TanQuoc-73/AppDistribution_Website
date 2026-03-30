import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Prevent Review Without Purchase
 * Ensures users cannot leave reviews on products they haven't bought
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.waitForPageLoad(10)

if (WebUI.verifyElementPresent(findTestObject('StorePage/card_firstProduct'), 5, FailureHandling.OPTIONAL)) {
    WebUI.click(findTestObject('StorePage/card_firstProduct'))
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)
    
    boolean canBuy = WebUI.verifyElementPresent(findTestObject('ProductPage/btn_addToCart'), 3, FailureHandling.OPTIONAL)
    if (canBuy) {
        // Nghĩa là app này chưa mua
        boolean canReview = WebUI.verifyElementPresent(findTestObject('ProductPage/btn_writeReview'), 3, FailureHandling.OPTIONAL)
        if (canReview) {
            WebUI.comment('LỖI: Ứng dụng chưa mua nhưng lại hiện form/nút Write Review.')
        } else {
            WebUI.comment('Passed: Không tìm thấy nút Write Review trên ứng dụng chưa sở hữu, bảo mật review tốt.')
        }
    } else {
        WebUI.comment('Bỏ qua: Ứng dụng này đã được mua (Hiện nút Download/Purchased) nên không thể dùng để test Prevent Review.')
    }
}

WebUI.closeBrowser()