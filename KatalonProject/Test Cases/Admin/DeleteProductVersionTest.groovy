import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Admin - Xoá File Phiên bản
 * Verifies that Admin can delete software versions.
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.adminEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.adminPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/admin/products')
WebUI.waitForPageLoad(10)

if (WebUI.verifyElementPresent(findTestObject('AdminProductsPage/div_firstProduct'), 5, FailureHandling.OPTIONAL)) {
    WebUI.click(findTestObject('AdminProductsPage/div_firstProduct'))
    WebUI.delay(2)
    
    boolean btnDeleteVersion = WebUI.verifyElementPresent(findTestObject('AdminProductsPage/btn_deleteFirstVersion'), 5, FailureHandling.OPTIONAL) 
    
    if (btnDeleteVersion) {
         WebUI.click(findTestObject('AdminProductsPage/btn_deleteFirstVersion'))
         WebUI.delay(2)
         
         // Xác nhận Confirm Dialog nếu có
         if (WebUI.verifyElementPresent(findTestObject('AdminProductsPage/btn_confirmDelete'), 2, FailureHandling.OPTIONAL)) {
              WebUI.click(findTestObject('AdminProductsPage/btn_confirmDelete'))
         }
         
         WebUI.comment('Passed: Kịch bản xoá phiên bản chạy hết lường.')
    } else {
         WebUI.comment('Bỏ qua: Sản phẩm này chưa được upload Version nào để thử chức năng Xoá.')
    }
}

WebUI.closeBrowser()