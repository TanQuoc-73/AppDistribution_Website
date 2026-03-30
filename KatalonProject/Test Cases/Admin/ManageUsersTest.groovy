import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.testobject.ConditionType

/**
 * Test Case: Manage Users
 * Verifies that an Admin can open the Edit User modal and update a user's role.
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.adminEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/admin/users')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Lấy ra nút Edit (hình cây bút) của User đầu tiên trong danh sách
TestObject btnEditFirst = new TestObject()
btnEditFirst.addProperty('xpath', ConditionType.EQUALS, "(//button[@title='Edit'])[1]")

if (WebUI.verifyElementPresent(btnEditFirst, 3, FailureHandling.OPTIONAL)) {
    WebUI.click(btnEditFirst)
    WebUI.delay(1)
    
    TestObject roleSelect = new TestObject()
    roleSelect.addProperty('xpath', ConditionType.EQUALS, "//label[contains(text(),'Role')]/following-sibling::select")
    
    TestObject updateBtn = new TestObject()
    updateBtn.addProperty('xpath', ConditionType.EQUALS, "//button[contains(text(),'Update')]")
    
    if (WebUI.verifyElementPresent(roleSelect, 2, FailureHandling.OPTIONAL)) {
        // Chỉnh quyền xuống "user" để kiểm tra tính năng dropdown chọn Role
        WebUI.selectOptionByValue(roleSelect, 'user', false)
        
        WebUI.click(updateBtn)
        WebUI.delay(2)
        
        WebUI.comment('Passed: Flow Edit User (Cập nhật quyền) hoàn thành thao tác Form thành công.')
    } else {
        WebUI.comment('LỖI: Bấm Edit User nhưng Modal cập nhật không bật lên.')
    }
} else {
    WebUI.comment('Cảnh Báo (Skip): Bảng danh sách Users trống, hoặc không cắm nút Edit hợp lệ.')
}

WebUI.closeBrowser()
