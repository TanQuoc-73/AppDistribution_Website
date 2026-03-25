import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Order History
 * Verifies that the orders page loads and displays order information
 */

// Login
WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setEncryptedText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Navigate to orders page
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/orders')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Verify orders page loads
WebUI.verifyElementPresent(findTestObject('OrdersPage/txt_ordersTitle'), 10)

// Check if orders exist
boolean hasOrders = WebUI.verifyElementPresent(findTestObject('OrdersPage/div_firstOrder'), 3, com.kms.katalon.core.model.FailureHandling.OPTIONAL)

if (hasOrders) {
    // Click first order to view details
    WebUI.click(findTestObject('OrdersPage/div_firstOrder'))
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)

    // Verify order detail page contains order information
    String orderUrl = WebUI.getUrl()
    assert orderUrl.contains('/orders/') : 'Did not navigate to order detail page'

    // Go back to orders list
    WebUI.back()
    WebUI.waitForPageLoad(10)
    WebUI.delay(1)
    WebUI.verifyElementPresent(findTestObject('OrdersPage/txt_ordersTitle'), 10)
} else {
    WebUI.verifyTextPresent('No orders', false)
    WebUI.comment('No orders found for this user')
}

WebUI.closeBrowser()
