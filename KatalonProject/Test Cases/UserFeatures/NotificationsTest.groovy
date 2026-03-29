import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Notifications Management
 * Verifies notifications page and mark as read functionality
 */

// Login
WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Navigate to notifications page
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/notifications')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Verify notifications page loads
WebUI.verifyElementPresent(findTestObject('NotificationsPage/txt_notificationsTitle'), 10)

// Check if mark all read button exists (means there are unread notifications)
boolean markAllReadPresent = WebUI.verifyElementPresent(findTestObject('NotificationsPage/btn_markAllRead'), 3, com.kms.katalon.core.model.FailureHandling.OPTIONAL)

if (markAllReadPresent) {
    WebUI.click(findTestObject('NotificationsPage/btn_markAllRead'))
    WebUI.delay(2)
    WebUI.comment('Marked all notifications as read')
} else {
    WebUI.comment('No unread notifications or notifications list is empty')
}

WebUI.closeBrowser()
