import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Register a new account
 * Verifies that a new user can register with valid details
 */

// Generate unique test data
String timestamp = new Date().format('yyyyMMddHHmmss')
String testUsername = 'testuser_' + timestamp
String testEmail = 'testuser_' + timestamp + '@example.com'
String testPassword = 'TestPassword123!'

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/register')
WebUI.maximizeWindow()

// Verify register page loads correctly
WebUI.verifyElementPresent(findTestObject('RegisterPage/txt_username'), 10)
WebUI.verifyElementPresent(findTestObject('RegisterPage/txt_email'), 10)
WebUI.verifyElementPresent(findTestObject('RegisterPage/txt_password'), 10)
WebUI.verifyElementPresent(findTestObject('RegisterPage/btn_register'), 10)

// Enter registration details
WebUI.setText(findTestObject('RegisterPage/txt_username'), testUsername)
WebUI.setText(findTestObject('RegisterPage/txt_email'), testEmail)
WebUI.setText(findTestObject('RegisterPage/txt_password'), testPassword)

// Click Register
WebUI.click(findTestObject('RegisterPage/btn_register'))
WebUI.delay(3)

// Verify success message or redirect to login page
WebUI.verifyElementPresent(findTestObject('RegisterPage/txt_successMessage'), 15)

WebUI.closeBrowser()
