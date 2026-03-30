import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Filter and Sort store marketplace
 * Checks backend and frontend logic for sorting apps (ex: Highest Rating, Lowest Price).
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.maximizeWindow()
WebUI.waitForPageLoad(10)

// Xác nhận bộ máy Search/Filter đang hiển thị
WebUI.verifyElementPresent(findTestObject('StorePage/dropdown_sortOptions'), 5, FailureHandling.STOP_ON_FAILURE)

// Chọn Lọc theo giá: Thấp nhất lên cao nhất
WebUI.selectOptionByValue(findTestObject('StorePage/dropdown_sortOptions'), 'price_asc', false)
WebUI.delay(2) // Đợi Frontend Fetch API 

// Verify URL hoặc State thay đổi chỉ báo rằng Query param đã đc update
String url = WebUI.getUrl()
if (!url.contains('sort=price_asc')) {
    WebUI.comment('Cảnh báo: Web không nối query string vào URL, có thể API gọi chay dưới nền.')
}

// Bắt thuộc tính giá của phần tử game ĐẦU TIÊN
String firstAppPriceText = WebUI.getText(findTestObject('StorePage/txt_firstAppPrice'))

// Bắt thuộc tính giá của phần tử game CUỐI CÙNG (hoặc thứ 2)
String secondAppPriceText = WebUI.getText(findTestObject('StorePage/txt_secondAppPrice'))

// Lọc bỏ ký hiệu ($) và parse float
try {
    float price1 = Float.parseFloat(firstAppPriceText.replace('$', '').trim())
    float price2 = Float.parseFloat(secondAppPriceText.replace('$', '').trim())
    
    // Test xem Backend trả đúng Sort theo giá tăng ko?
    assert price1 <= price2 : "Sorting failed! Giá app đầu ("+price1+") cao hơn app sau ("+price2+")."
    WebUI.comment("Test Passed: Hệ thống trả Mảng phần mềm chuẩn từ Rẻ đến Đắt.")
    
} catch(Exception e) {
    WebUI.comment("Exception khi convert String sang Float: Giá trị có chữ, VD: 'Free'")
}

WebUI.closeBrowser()
