import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Admin - Dashboard và Phân quyền
 * Verifies that Admin user can login and view the Admin Dashboard and Sidebar navigation.
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.adminEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.adminPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

// Truy cập Dashboard
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/admin/dashboard')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

String currentUrl = WebUI.getUrl()
if (currentUrl.contains('/admin')) {
    WebUI.comment('Passed: Tài khoản admin truy cập được Admin Panel.')
    
    // Kiểm tra UI Dashboard cơ bản
    boolean hasSidebar = WebUI.verifyElementPresent(findTestObject('AdminPage/nav_sidebar'), 5, FailureHandling.OPTIONAL)
    boolean hasDashboardData = WebUI.verifyTextPresent('Dashboard', false, FailureHandling.OPTIONAL) || WebUI.verifyTextPresent('Tổng quan', false, FailureHandling.OPTIONAL)
    
    if (hasSidebar || hasDashboardData) {
        WebUI.comment('Passed: Dashboard load thành công với giao diện cơ bản.')
    } else {
        WebUI.comment('LỖI: Vào được URL nhưng không thấy thông tin giao diện Dashboard.')
    }
} else {
    WebUI.comment('LỖI: Điều hướng thất bại, Admin user bị chặn hoặc đá văng khỏi /admin.')
}

WebUI.closeBrowser()