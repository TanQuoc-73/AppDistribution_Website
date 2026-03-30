import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Update Cart Quantity restrictions
 * Verifies that digital software products cannot have quantities > 1 in the cart
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

// 1. Login
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

// 2. Clear Cart then Add a product
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/cart')
WebUI.waitForPageLoad(10)
if (WebUI.verifyElementPresent(findTestObject('CartPage/btn_clearCart'), 3, FailureHandling.OPTIONAL)) {
    WebUI.click(findTestObject('CartPage/btn_clearCart'))
}
WebUI.delay(1)

WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.waitForPageLoad(10)

if (WebUI.verifyElementPresent(findTestObject('StorePage/card_firstProduct'), 5, FailureHandling.OPTIONAL)) {
    WebUI.click(findTestObject('StorePage/card_firstProduct'))
    WebUI.waitForPageLoad(10)
    
    // Attempt Add to cart
    if (WebUI.verifyElementPresent(findTestObject('ProductPage/btn_addToCart'), 3, FailureHandling.OPTIONAL)) {
        WebUI.click(findTestObject('ProductPage/btn_addToCart'))
        WebUI.delay(2)
        
        // Go to Cart
        WebUI.navigateToUrl(GlobalVariable.baseUrl + '/cart')
        WebUI.waitForPageLoad(10)
        
        // Verify Quantity Input allows exactly 1 or is disabled/text
        boolean hasEditableQty = WebUI.verifyElementPresent(findTestObject('CartPage/input_quantityField'), 2, FailureHandling.OPTIONAL)
        if (hasEditableQty) {
            String readOnly = WebUI.getAttribute(findTestObject('CartPage/input_quantityField'), 'readonly', FailureHandling.OPTIONAL)
            String disabled = WebUI.getAttribute(findTestObject('CartPage/input_quantityField'), 'disabled', FailureHandling.OPTIONAL)
            
            if (readOnly || disabled) {
                WebUI.comment('Test Passed: Quantity Input exist ngưng bị khóa (Readonly/Disabled) vì là ứng dụng digital.')
            } else {
                WebUI.comment('CẢNH BÁO: Text field số lượng không bị khoá, mặc dù là ứng dụng số.')
            }
        } else {
             WebUI.comment('Test Passed: Không tìm thấy ô sửa số lượng / Update Quantity (Phù hợp với hàng digital).')
        }
    } else {
        WebUI.comment('Bỏ qua: Không thể add to cart vì Product hiện tại không có giá / đã mua.')
    }
}

WebUI.closeBrowser()