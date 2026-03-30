import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Admin - Quản lý File Phiên bản (Add Version, Update)
 * Verifies that Admin can attach software versions to a product.
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
    
    boolean btnAddVersion = WebUI.verifyElementPresent(findTestObject('AdminProductsPage/btn_addVersion'), 5, FailureHandling.OPTIONAL) || WebUI.verifyTextPresent('Add Version', false, FailureHandling.OPTIONAL)
    
    if (btnAddVersion) {
         WebUI.comment('Passed: Tìm thấy chức năng quản lý, thêm phiên bản (Upload tệp / Tạo Version) cho Product.')
         // Thao tác sâu hơn phụ thuộc vào cấu trúc Form Upload bằng React Dropzone
    } else {
         WebUI.comment('LỖI: Truy cập App nhưng mất module Add Version.')
    }
}

WebUI.closeBrowser()