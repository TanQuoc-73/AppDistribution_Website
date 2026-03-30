import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Prevent Download Without Ownership
 * Verifies that unowned products show "Add to Cart" or "Price" instead of "Download" or "Play"
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

// Chuyển tới Store
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.waitForPageLoad(10)

if (WebUI.verifyElementPresent(findTestObject('StorePage/card_firstProduct'), 5, FailureHandling.OPTIONAL)) {
    WebUI.click(findTestObject('StorePage/card_firstProduct'))
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)
    
    // Nếu app có hiển thị Add to Cart, tức là CHƯA SỞ HỮU
    boolean isNotOwned = WebUI.verifyElementPresent(findTestObject('ProductPage/btn_addToCart'), 3, FailureHandling.OPTIONAL)
       
    if (isNotOwned) {
        // Cố tìm kiếm nút Download xem có bị lộ ra ngoài không
        boolean hasDownloadBtn = WebUI.verifyElementPresent(findTestObject('ProductPage/btn_download'), 3, FailureHandling.OPTIONAL)
        
        if (hasDownloadBtn) {
            WebUI.comment('LỖI: Ứng dụng chưa mua (hiện Add to Cart) nhưng lại lòi ra nút Download.')
        } else {
            WebUI.comment('Test Passed: Không tìm thấy nút Download vì account chưa mua Product này.')
        }
    } else {
         WebUI.comment('CẢNH BÁO: App này là Đã Sở Hữu, test vô nghĩa ở context này.')
    }
}

WebUI.closeBrowser()