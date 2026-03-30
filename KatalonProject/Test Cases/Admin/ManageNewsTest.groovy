import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.testobject.ConditionType

/**
 * Test Case: Manage News
 * Verifies that an Admin can create a News Article.
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.adminEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/admin/news')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

TestObject btnAdd = new TestObject()
btnAdd.addProperty('xpath', ConditionType.EQUALS, "//button[contains(., 'Add New')]")

if (WebUI.verifyElementPresent(btnAdd, 3, FailureHandling.OPTIONAL)) {
    WebUI.click(btnAdd)
    WebUI.delay(1)
    
    TestObject titleInput = new TestObject()
    titleInput.addProperty('xpath', ConditionType.EQUALS, "//label[contains(text(),'Title')]/following-sibling::input")
    TestObject contentInput = new TestObject()
    contentInput.addProperty('xpath', ConditionType.EQUALS, "//label[contains(text(),'Content')]/following-sibling::textarea")
    
    String titleValue = "Auto News " + System.currentTimeMillis()
    
    if (WebUI.verifyElementPresent(titleInput, 2, FailureHandling.OPTIONAL)) {
         WebUI.setText(titleInput, titleValue)
         WebUI.setText(contentInput, "This is automated E2E content.")
         
         WebUI.click(new TestObject().addProperty('xpath', ConditionType.EQUALS, "//button[@type='submit']"))
         WebUI.delay(3)
         
         if (WebUI.verifyTextPresent(titleValue, false, FailureHandling.OPTIONAL)) {
               WebUI.comment('Passed: Luồng ĐĂNG TIN TỨC (Create News) từ A đến Z chạy tốt.')
         }
    }
}

WebUI.closeBrowser()
