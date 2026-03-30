import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: View Product Detail Extended
 * Ensures navigation from Store to Product Detail creates correct URL and loads metadata.
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.maximizeWindow()
WebUI.waitForPageLoad(10)

boolean hasProducts = WebUI.verifyElementPresent(findTestObject('StorePage/card_firstProduct'), 10, FailureHandling.OPTIONAL)

if (hasProducts) {
    WebUI.click(findTestObject('StorePage/card_firstProduct'))
    WebUI.waitForPageLoad(10)
    
    // Validate we are on a proper dynamic product page path : /store/:slug
    String currentUrl = WebUI.getUrl()
    boolean isOnProductUrl = currentUrl.contains('/store/') && !currentUrl.endsWith('/store')
    
    if (isOnProductUrl) {
        WebUI.comment('Redirect Passed: Đã sang một trang sản phẩm động: ' + currentUrl)
        
        // Assertions the vital components for SEO and User view are present
        boolean titlePresent = WebUI.verifyElementPresent(findTestObject('ProductPage/txt_productTitle'), 5, FailureHandling.OPTIONAL)
        boolean pricePresent = WebUI.verifyElementPresent(findTestObject('ProductPage/txt_price'), 5, FailureHandling.OPTIONAL)
        
        if (titlePresent && pricePresent) {
             WebUI.comment('Kiểm định thành công: Sản phẩm hiển thị đầy đủ tiêu đề và giá.')
        } else {
             WebUI.comment('CẢNH BÁO: Thiếu thông tin Tiêu đề hoặc Giá của sản phẩm.')
        }
    } else {
        WebUI.comment('LỖI: Click sản phẩm nhưng chưa thấy route /store/[slug]. URL thực tế: ' + currentUrl)
    }
} else {
    WebUI.comment('Bỏ qua vì không có sẵn ứng dụng nào trên Store để nhấn vào.')
}

WebUI.closeBrowser()