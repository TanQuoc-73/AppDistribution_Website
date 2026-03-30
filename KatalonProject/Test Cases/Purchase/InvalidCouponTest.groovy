import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import org.openqa.selenium.Keys as Keys

/**
 * Test Case: Invalid Coupon Handling
 * Verifies that the marketplace rejects invalid/expired coupons at Checkout and does NOT apply discounts.
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

// Login
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

// Xong rồi thì vào thẳng xem giỏ hàng Checkout (Giả định đang có sản phẩm)
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/checkout')
WebUI.waitForPageLoad(10)

// Bắt đầu nhập mã dỏm
WebUI.setText(findTestObject('Checkout/txt_couponCode'), 'HACKER_CODE_123')
WebUI.click(findTestObject('Checkout/btn_applyCoupon'))
WebUI.delay(3)

// Verify thông báo lỗi coupon bật lên
WebUI.verifyTextPresent('Invalid or expired coupon', false, FailureHandling.STOP_ON_FAILURE)

// Verify tổng tiền KHÔNG BỊ ảnh hưởng / giảm lén
boolean verifyDiscountApplied = WebUI.verifyElementNotPresent(findTestObject('Checkout/txt_discountAmount'), 3, FailureHandling.OPTIONAL)
if(verifyDiscountApplied) {
    WebUI.comment('Pass: Coupon invalid không làm thay đổi Bill thanh toán.')
}

WebUI.closeBrowser()
