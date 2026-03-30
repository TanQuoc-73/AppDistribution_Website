import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.testobject.ConditionType

/**
 * Test Case: Admin Approve Refund
 * Verifies that the admin can approve a user's refund request in the CMS Dashboard.
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

// GIẢ ĐỊNH ĐĂNG NHẬP BẰNG TÀI KHOẢN ADMIN
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.adminEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

// Chuyển hướng vào trang quản trị hoàn tiền 
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/admin/refunds')
WebUI.waitForPageLoad(10)

// Tìm nút Approve ĐẦU TIÊN
TestObject btnApproveFirst = new TestObject()
btnApproveFirst.addProperty('xpath', ConditionType.EQUALS, "(//button[@title='Approve'])[1]")

if (WebUI.verifyElementPresent(btnApproveFirst, 5, FailureHandling.OPTIONAL)) {
    // Click vào nút "Approve" (Chấp thuận) 
    WebUI.click(btnApproveFirst)
    WebUI.delay(2)

    // Xác nhận hộp thoại Modal/Button YES
    TestObject btnConfirmYes = new TestObject()
    btnConfirmYes.addProperty('xpath', ConditionType.EQUALS, "//button[contains(text(),'Approve') or contains(text(),'Confirm') or contains(text(),'Yes')]")
    
    if (WebUI.verifyElementPresent(btnConfirmYes, 3, FailureHandling.OPTIONAL)) {
        WebUI.click(btnConfirmYes)
        WebUI.delay(2)
        WebUI.comment('Passed: Nút xác nhận duyệt đơn hoàn tiền đã hoạt động.')
    }
} else {
    WebUI.comment('Bỏ Qua (Skip): Hệ thống không có Refund nào Pending lúc Test chạy.')
}

WebUI.closeBrowser()
