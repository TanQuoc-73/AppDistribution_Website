import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Register with invalid data
 * Verifies validation errors for registration form edge cases
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/register')
WebUI.maximizeWindow()

// Test 1: Username too short (min 3 characters)
WebUI.setText(findTestObject('RegisterPage/txt_username'), 'ab')
WebUI.setText(findTestObject('RegisterPage/txt_email'), 'valid@example.com')
WebUI.setText(findTestObject('RegisterPage/txt_password'), 'ValidPass123!')
WebUI.click(findTestObject('RegisterPage/btn_register'))
WebUI.delay(2)

// Verify user stays on register page (HTML5 validation or error message)
WebUI.verifyElementPresent(findTestObject('RegisterPage/btn_register'), 5)

// Reload trang để xóa sạch React state và HTML5 validation popup
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/register')
WebUI.waitForPageLoad(5)
WebUI.delay(1)

// Test 2: Password too short (min 8 characters)
WebUI.setText(findTestObject('RegisterPage/txt_username'), 'validuser')
WebUI.setText(findTestObject('RegisterPage/txt_email'), 'valid@example.com')
WebUI.setText(findTestObject('RegisterPage/txt_password'), 'short')
WebUI.click(findTestObject('RegisterPage/btn_register'))
WebUI.delay(2)

WebUI.verifyElementPresent(findTestObject('RegisterPage/btn_register'), 5)

// Reload trang
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/register')
WebUI.waitForPageLoad(5)
WebUI.delay(1)

// Test 3: Invalid email format
WebUI.setText(findTestObject('RegisterPage/txt_username'), 'validuser')
WebUI.setText(findTestObject('RegisterPage/txt_email'), 'not-an-email')
WebUI.setText(findTestObject('RegisterPage/txt_password'), 'ValidPass123!')
WebUI.click(findTestObject('RegisterPage/btn_register'))
WebUI.delay(2)

WebUI.verifyElementPresent(findTestObject('RegisterPage/btn_register'), 5)

// Test 4: Empty form submission
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/register')
WebUI.waitForPageLoad(5)
WebUI.delay(1)
WebUI.click(findTestObject('RegisterPage/btn_register'))
WebUI.delay(1)

WebUI.verifyElementPresent(findTestObject('RegisterPage/btn_register'), 5)

WebUI.closeBrowser()
