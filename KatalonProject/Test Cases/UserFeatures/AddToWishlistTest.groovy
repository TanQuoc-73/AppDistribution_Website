import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Add To Wishlist / Toggle Wishlist
 * Verifies that a user can heart an app to save it to their Wishlist dashboard.
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

// Trở về trang cửa hàng
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.waitForPageLoad(10)

// Locate một ứng dụng bất kỳ (còn nút Heart rỗng) và verify nó tồn tại
WebUI.verifyElementPresent(findTestObject('StorePage/btn_heartEmpty'), 5, FailureHandling.STOP_ON_FAILURE)

// Click thả tim
WebUI.click(findTestObject('StorePage/btn_heartEmpty'))
WebUI.delay(1)

// Xác nhận toast notification (Thêm thành công)
WebUI.verifyTextPresent('Added to wishlist', false, FailureHandling.CONTINUE_ON_FAILURE)

// Điều hướng sang trang Wishlist của User xem có thực sự nằm ở đó không
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/profile/wishlist')
WebUI.waitForPageLoad(10)

// Kiểm tra Grid hiển thị có chứa phần tử App Card
WebUI.verifyElementPresent(findTestObject('WishlistPage/div_appCardFilled'), 5, FailureHandling.STOP_ON_FAILURE)

WebUI.closeBrowser()
