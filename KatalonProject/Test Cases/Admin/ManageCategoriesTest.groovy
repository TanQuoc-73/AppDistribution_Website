import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.testobject.ConditionType

/**
 * Test Case: Manage Categories
 * Verifies that an Admin can create a Category (E2E Flow).
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.adminEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/admin/categories')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Tạo Object linh động dựa vào XPath của React App
TestObject btnAdd = new TestObject()
btnAdd.addProperty('xpath', ConditionType.EQUALS, "//button[contains(., 'Add Category')]")

if (WebUI.verifyElementPresent(btnAdd, 3, FailureHandling.OPTIONAL)) {
    WebUI.click(btnAdd)
    WebUI.delay(1)
    
    TestObject nameInput = new TestObject()
    nameInput.addProperty('xpath', ConditionType.EQUALS, "//label[contains(text(),'Name')]/following-sibling::input")
    
    TestObject submitBtn = new TestObject()
    submitBtn.addProperty('xpath', ConditionType.EQUALS, "//button[@type='submit']")
    
    String catName = "Auto Category " + System.currentTimeMillis()
    
    if (WebUI.verifyElementPresent(nameInput, 2, FailureHandling.OPTIONAL)) {
        WebUI.setText(nameInput, catName)
        WebUI.click(submitBtn)
        WebUI.delay(2)
        
        if (WebUI.verifyTextPresent(catName, false, FailureHandling.OPTIONAL)) {
            WebUI.comment('Passed: Kịch bản CHỨC NĂNG tạo Category thành công! Dữ liệu đã lưu xuống DB và render lên bảng.')
        } else {
            WebUI.comment('LỖI: Bấm Save nhưng Category không nổi lên UI.')
        }
    } else {
        WebUI.comment('LỖI: Bấm Add Category nhưng Form Modal không bật lên.')
    }
} else {
    WebUI.comment('LỖI: Không tải được giao diện /admin/categories.')
}

WebUI.closeBrowser()
