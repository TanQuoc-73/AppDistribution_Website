import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Request Refund
 * Verifies that a user can submit a refund request for a recently purchased app from their Order History.
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

// Login
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

// Đi tới Lịch sử Đơn Hàng (Order History)
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/profile/orders')
WebUI.waitForPageLoad(10)

// Kiểm tra xem có Nút Yêu cầu hoàn tiền ở hóa đơn gần nhất không
boolean canRefund = WebUI.verifyElementPresent(findTestObject('OrderHistory/btn_requestRefund'), 5, FailureHandling.OPTIONAL)

if(canRefund) {
    WebUI.click(findTestObject('OrderHistory/btn_requestRefund'))
    WebUI.delay(1)
    
    // Nhập lý do (Reason)
    WebUI.setText(findTestObject('OrderHistory/txt_refundReason'), 'The game crashes on startup for my OS.')
    
    // Submit
    WebUI.click(findTestObject('OrderHistory/btn_submitRefund'))
    WebUI.delay(2)
    
    // Verify thông báo gửi thành công và tình trạng đơn bị đổi mác (Pending Refund)
    WebUI.verifyTextPresent('Refund request submitted successfully', false, FailureHandling.STOP_ON_FAILURE)
    WebUI.verifyElementPresent(findTestObject('OrderHistory/badge_pendingRefund'), 5)
} else {
    WebUI.comment('Không có đơn hàng nào đủ điều kiện hoàn tiền (vd: Quá hạn 14 ngày)')
}

WebUI.closeBrowser()
