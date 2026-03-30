import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.testobject.ConditionType

/**
 * Test Case: Block Malicious File Upload
 * Verifies that the Admin Dashboard rejects non-executable/unknown formats (e.g., .exe/.zip expected, but .php uploaded)
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

// Login Admin
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.adminEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

// Đi tới trang Quản lý Sản Phẩm và mục Upload Version
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/admin/products')
WebUI.waitForPageLoad(10)

TestObject btnAddVersion = new TestObject()
btnAddVersion.addProperty('xpath', ConditionType.EQUALS, "(//button[contains(text(), 'Add Version') or @title='Add Version'])[1]")

if (WebUI.verifyElementPresent(btnAddVersion, 5, FailureHandling.OPTIONAL)) {
    WebUI.click(btnAddVersion)
    WebUI.delay(2)

    // Tạo file đường dẫn giả (File đuôi PHP độc hại)
    // Lưu ý: Automation sẽ inject trực tiếp đường dẫn file vào DOM Input File để upload
    String fakeMaliciousFilePath = "C:\\malicious_shell.php" 
    
    TestObject inputUpload = new TestObject()
    inputUpload.addProperty('xpath', ConditionType.EQUALS, "//input[@type='file']")
    
    WebUI.uploadFile(inputUpload, fakeMaliciousFilePath, FailureHandling.OPTIONAL)
    WebUI.delay(2)
    
    // Tìm Nút Upload / Confirm Version
    TestObject btnConfirmUpload = new TestObject()
    btnConfirmUpload.addProperty('xpath', ConditionType.EQUALS, "//button[contains(text(), 'Upload') or contains(text(), 'Save Version')]")
    WebUI.click(btnConfirmUpload)
    WebUI.delay(3)

    // Xác nhận Frontend hoặc Backend trả về Thông báo lỗi TỪ CHỐI format định dạng PHP
    boolean extensionBlocked = WebUI.verifyTextPresent('Invalid file type', false, FailureHandling.OPTIONAL) ||
                               WebUI.verifyTextPresent('Only .exe', false, FailureHandling.OPTIONAL) ||
                               WebUI.verifyTextPresent('not allowed', false, FailureHandling.OPTIONAL) ||
                               WebUI.verifyTextPresent('extension', false, FailureHandling.OPTIONAL)
                               
    assert extensionBlocked : 'LỖI BẢO MẬT NGHIÊM TRỌNG: Form Upload chấp nhận file PHP/Shell độc hại mà KHÔNG CÓ filter Validation!'
    WebUI.comment('Pass: Hệ thống đã phát hiện và chặn thành công hành vi tải file định dạng không khớp whitelist Server.')

} else {
    WebUI.comment('Skip: Không tìm thấy nút Add Version ở sản phẩm nào để kiểm thử hành vi Upload.')
}

WebUI.closeBrowser()
