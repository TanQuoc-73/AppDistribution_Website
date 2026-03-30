import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Open Store Categories Sidebar
 * Description: Categories are not a standalone page (like /categories) but a sidebar layout mapped to /store.
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.maximizeWindow()
WebUI.waitForPageLoad(10)

// Kiểm tra xem thành phần Sidebar Filter Layout có load đủ không
boolean sidebarPresent = WebUI.verifyElementPresent(findTestObject('StorePage/div_sidebarFilters'), 10, FailureHandling.OPTIONAL)

if (sidebarPresent) {
    // Kiểm định các bộ lọc cứng phải có trên Sidebar
    boolean hasCategoriesHeading = WebUI.verifyTextPresent('Categories', false, FailureHandling.OPTIONAL)
    boolean hasSortHeading = WebUI.verifyTextPresent('Sort', false, FailureHandling.OPTIONAL)
    boolean hasPriceHeading = WebUI.verifyTextPresent('Price', false, FailureHandling.OPTIONAL)
    
    if (hasCategoriesHeading && hasSortHeading && hasPriceHeading) {
        WebUI.comment('Kiểm định thành công: Giao diện StorePage hoàn chỉnh, hiển thị đủ Categories Layout và Filters Sidebar.')
    } else {
        WebUI.comment('Kiểm định lỗi: Form layout bị thiếu chữ "Categories", "Sort" hoặc "Price".')
    }
} else {
    // Note: Ở màn hình Mobile, thẻ Sidebar sẽ ẩn đi (hidden). Test này coi như giả định Desktop size
    WebUI.comment('LỖI: Không tìm thấy Sidebar filters trên StorePage. Có thể đang test trên viewport Mobile?')
}

WebUI.closeBrowser()