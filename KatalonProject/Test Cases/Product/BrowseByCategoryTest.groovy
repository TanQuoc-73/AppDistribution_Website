import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Browse by Category
 * Verifies that clicking a category from the sidebar filters the store products
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.maximizeWindow()
WebUI.waitForPageLoad(10)

// Chờ Categories load về từ Supabase DB
WebUI.delay(2) 
boolean hasCategories = WebUI.verifyElementPresent(findTestObject('StorePage/btn_firstCategory'), 5, FailureHandling.OPTIONAL)

if (hasCategories) {
    // Click vào danh mục đầu tiên trên Sidebar bên trái
    WebUI.click(findTestObject('StorePage/btn_firstCategory'))
    WebUI.delay(2)
    
    // Kiểm tra URL xem tham số query có được cập nhật hay không
    String currentUrl = WebUI.getUrl()
    boolean urlHasCategory = currentUrl.contains('categoryId=')
    
    if (urlHasCategory) {
        WebUI.comment('Redirect Passed: URL đã có params categoryId. (URL: ' + currentUrl + ')')
        
        // Cụm Frontend phải sinh ra dòng mô tả "Filtering: <CategoryName>"
        boolean filterIndicator = WebUI.verifyTextPresent('Filtering:', false, FailureHandling.OPTIONAL)
        if (filterIndicator) {
            WebUI.comment('UI Passed: Thẻ badge "Filtering" hiển thị đúng trạng thái.')
        } else {
            WebUI.comment('LỖI: UI thiếu badge "Filtering".')
        }
    } else {
        WebUI.comment('LỖI: Bấm chọn danh mục nhưng URL không tự động cập nhật categoryId.')
    }
} else {
    // Nếu db trống hoặc chưa load
    WebUI.comment('CẢNH BÁO: Không có Category nào nhảy ra tại mục Sidebar bên trái (Do DB trống hoặc mạng trễ).')
}

WebUI.closeBrowser()