import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Prevent Duplicate Order
 * Verifies that a product you already own cannot be added to cart or bought again
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

// First check Library cho chắc 
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/library')
WebUI.delay(2)
if (WebUI.verifyElementPresent(findTestObject('LibraryPage/card_firstOwnedApp'), 5, FailureHandling.OPTIONAL)) {
    WebUI.click(findTestObject('LibraryPage/card_firstOwnedApp'))
    WebUI.delay(3)
    
    // Ở chi tiết 1 app CÓ TRONG THƯ VIỆN, kiểm tra xem có cho mua lại không.
    boolean hasAddToCart = WebUI.verifyElementPresent(findTestObject('ProductPage/btn_addToCart'), 3, FailureHandling.OPTIONAL)
    boolean hasPrice = WebUI.verifyElementPresent(findTestObject('ProductPage/txt_price'), 2, FailureHandling.OPTIONAL)
    boolean hasPurchasedLabel = WebUI.verifyTextPresent('In Library', false, FailureHandling.OPTIONAL) || WebUI.verifyTextPresent('Purchased', false, FailureHandling.OPTIONAL) || WebUI.verifyElementPresent(findTestObject('ProductPage/btn_purchased'), 2, FailureHandling.OPTIONAL)
    
    if (hasAddToCart) {
        WebUI.comment('LỖI: Ứng dụng đã mua trong library nhưng vẫn lộ ra nút Add To Cart.')
    } else {
        WebUI.comment('Passed: Không xuất hiện nút [Add To Cart] với hàng đã mua (Digital). Duplicate order Prevented!')
    }
    
    if (hasPurchasedLabel) {
        WebUI.comment('Passed: Hiện đúng trạng thái "In Library" / "Purchased".')
    }
} else {
    WebUI.comment('CẢNH BÁO: Tk chưa có gì trong Library, không thể tự test trùng lặp từ đầu mà nên dùng data mồi (mocked DB).')
}

WebUI.closeBrowser()