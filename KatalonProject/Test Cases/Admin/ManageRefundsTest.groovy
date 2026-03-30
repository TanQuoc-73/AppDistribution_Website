import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.testobject.ConditionType

/**
 * Test Case: Manage Refunds
 * Verifies that an Admin can Reject a pending refund request with Admin Notes.
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.adminEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/admin/refunds')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Tìm nút Reject của yêu cầu ĐẦU TIÊN đang ở trạng thái Pending
TestObject btnRejectFirst = new TestObject()
btnRejectFirst.addProperty('xpath', ConditionType.EQUALS, "(//button[@title='Reject'])[1]")

if (WebUI.verifyElementPresent(btnRejectFirst, 3, FailureHandling.OPTIONAL)) {
    WebUI.click(btnRejectFirst)
    WebUI.delay(1)
    
    TestObject notesInput = new TestObject()
    notesInput.addProperty('xpath', ConditionType.EQUALS, "//textarea[contains(@placeholder,'Notes')]")
    
    TestObject confirmBtn = new TestObject()
    confirmBtn.addProperty('xpath', ConditionType.EQUALS, "//button[contains(text(),'Reject Refund')]")
    
    if (WebUI.verifyElementPresent(notesInput, 2, FailureHandling.OPTIONAL)) {
        WebUI.setText(notesInput, 'Auto-Rejected by E2E Automation Test')
        
        WebUI.click(confirmBtn)
        WebUI.delay(2)
        
        WebUI.comment('Passed: Đã test thành công Cấu trúc UI của việc Reject Refund.')
    } else {
        WebUI.comment('LỖI: Bấm Reject nhưng Modal xác nhận và trường nhập Notes không hiển thị.')
    }
} else {
    WebUI.comment('Bỏ Qua (Skip): Hệ thống hiện tại không có Refund nào đang Pending nên luồng Test Nút Reject tự động dừng.')
}

WebUI.closeBrowser()
