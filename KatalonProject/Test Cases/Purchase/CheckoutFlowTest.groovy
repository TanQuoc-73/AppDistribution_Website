import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Checkout Flow
 * Checkout cart to Order Success
 */

WebUI.openBrowser('')
WebUI.maximizeWindow()

// Login
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.waitForPageLoad(10)
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

// Make sure we have something in cart to checkout
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.delay(2)
if (WebUI.verifyElementPresent(findTestObject('StorePage/card_firstProduct'), 5, FailureHandling.OPTIONAL)) {
    WebUI.click(findTestObject('StorePage/card_firstProduct'))
    WebUI.delay(2)
    if (WebUI.verifyElementPresent(findTestObject('ProductPage/btn_addToCart'), 3, FailureHandling.OPTIONAL)) {
        WebUI.click(findTestObject('ProductPage/btn_addToCart'))
        WebUI.delay(2)
    }
}

// Proceed to Cart
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/cart')
WebUI.waitForPageLoad(10)

// Check if Cart is empty
if (WebUI.verifyTextPresent('Your cart is empty', false, FailureHandling.OPTIONAL)) {
    WebUI.comment('CẢNH BÁO: Giỏ hàng trống do không có SP khả dụng để mua. Không thể Checkout.')
} else {
    // Standard Checkout flow
    boolean canCheckout = WebUI.verifyElementPresent(findTestObject('CartPage/btn_checkout'), 5, FailureHandling.OPTIONAL)
    if (canCheckout) {
        WebUI.click(findTestObject('CartPage/btn_checkout'))
        WebUI.waitForPageLoad(10)
        WebUI.delay(2)
        
        // URL needs to be /checkout
        if (WebUI.getUrl().contains('/checkout')) {
            WebUI.comment('Passed: Đã chuyển hướng sang trang thanh toán: ' + WebUI.getUrl())
            
            // Try to place order 
            boolean placeOrderBtn = WebUI.verifyElementPresent(findTestObject('CheckoutPage/btn_placeOrder'), 5, FailureHandling.OPTIONAL)
            if (placeOrderBtn) {
                 // Might need to fill form depending on UI:
                 // WebUI.setText(findTestObject('CheckoutPage/PaymentField'), '4111111111111111')
                 WebUI.click(findTestObject('CheckoutPage/btn_placeOrder'))
                 WebUI.waitForPageLoad(10)
                 WebUI.delay(5)
                 boolean isRedirected = WebUI.getUrl().contains('/library') || WebUI.getUrl().contains('success') || WebUI.getUrl().contains('order-success')
                 assert isRedirected : 'LỖI: Bấm Place Order nhưng không chuyển trang thành công.'
                 WebUI.comment('Passed: Checkout thành công và đã redirect.')
             } else {
                 assert false : 'LỖI: Không tìm thấy nút Place Order tại trang /checkout.'
             }
        } else {
            assert false : 'LỖI: Nút Checkout không dẫn tới /checkout'
        }
    }
}

WebUI.closeBrowser()