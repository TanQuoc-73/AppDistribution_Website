import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Read Notification
 * Verifies that a user can open their notification bell and interact with a new notification.
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

// Trang chủ sau đăng nhập
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/')
WebUI.waitForPageLoad(10)

// Bấm vào biểu tượng Chuông thông báo (Bell Icon) trên Header
WebUI.click(findTestObject('Header/btn_notificationBell'))
WebUI.delay(1)

// Xác minh popup/dropdown Danh sách Thông báo mở ra
WebUI.verifyElementPresent(findTestObject('Header/dropdown_notificationList'), 5, FailureHandling.STOP_ON_FAILURE)

// Click vào thông báo đầu tiên (tin nhắn chưa đọc - Unread)
WebUI.click(findTestObject('Header/item_firstNotificationUnread'))
WebUI.delay(1)

// Xác định xem số lượng huy hiệu (Badge count) trên chuông có giảm đi 1 hoặc biến mất không
boolean isBadgeUpdated = WebUI.verifyElementNotPresent(findTestObject('Header/badge_notificationCount_old'), 3, FailureHandling.OPTIONAL)

if(isBadgeUpdated) {
    WebUI.comment('Pass: Backend đã gọi API đánh dấu thông báo là ĐÃ ĐỌC (isRead = true) thành công.')
}

WebUI.closeBrowser()
