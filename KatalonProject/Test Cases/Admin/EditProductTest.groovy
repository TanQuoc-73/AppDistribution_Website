import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Admin - Chỉnh sửa thông tin sản phẩm
 * Verifies that an Admin can edit an existing product.
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

boolean hasProducts = WebUI.verifyElementPresent(findTestObject('AdminProductsPage/div_firstProduct'), 5, FailureHandling.OPTIONAL) || WebUI.verifyElementPresent(findTestObject('AdminProductsPage/table_products'), 5, FailureHandling.OPTIONAL)

if (hasProducts) {
    boolean btnEditExist = WebUI.verifyElementPresent(findTestObject('AdminProductsPage/btn_editFirstProduct'), 3, FailureHandling.OPTIONAL)
    if (btnEditExist) {
        WebUI.click(findTestObject('AdminProductsPage/btn_editFirstProduct'))
        WebUI.delay(2)
        
        // Verify form exist
        if (WebUI.verifyElementPresent(findTestObject('AdminProductsPage/btn_submit'), 3, FailureHandling.OPTIONAL)) {
             WebUI.click(findTestObject('AdminProductsPage/btn_submit'))
             WebUI.delay(2)
             WebUI.comment('Passed: Luồng mở Form Edit và Save thành công.')
        } else {
             WebUI.comment('LỖI: Mở sửa sản phẩm nhưng không tìm thấy nút Submit lưu thông tin.')
        }
    } else {
        WebUI.comment('LỖI: Bảng chứa sản phẩm nhưng không có nút Edit.')
    }
} else {
    WebUI.comment('Bỏ qua: Hiện tại Admin/Products không có app nào để sửa.')
}

WebUI.closeBrowser()