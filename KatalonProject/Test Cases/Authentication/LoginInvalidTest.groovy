import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Login with invalid credentials
 * Verifies that appropriate error message is shown for wrong email/password
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

// Verify login page loaded
WebUI.verifyElementPresent(findTestObject('LoginPage/txt_email'), 10)

// Test 1: Invalid email format
// Do input type="email" có HTML5 validation, form sẽ không submit được nên không có error message từ server
WebUI.setText(findTestObject('LoginPage/txt_email'), 'invalidemail')
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.delay(2)

// Verify user vẫn ở lại trang login (form chưa được submit)
WebUI.verifyElementPresent(findTestObject('LoginPage/btn_signIn'), 5)

// Clear fields
WebUI.clearText(findTestObject('LoginPage/txt_email'))
WebUI.clearText(findTestObject('LoginPage/txt_password'))

// Test 2: Wrong password
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), 'WrongPassword123!')
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.delay(2)

// Verify error message appears
WebUI.verifyElementPresent(findTestObject('LoginPage/txt_errorMessage'), 10)

// Clear fields
WebUI.clearText(findTestObject('LoginPage/txt_email'))
WebUI.clearText(findTestObject('LoginPage/txt_password'))

// Test 3: Empty fields
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.delay(1)

// Verify user stays on login page
WebUI.verifyElementPresent(findTestObject('LoginPage/btn_signIn'), 5)

// Test 4: Non-existent email
WebUI.setText(findTestObject('LoginPage/txt_email'), 'nonexistent@example.com')
WebUI.setText(findTestObject('LoginPage/txt_password'), 'SomePassword123!')
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.delay(2)

WebUI.verifyElementPresent(findTestObject('LoginPage/txt_errorMessage'), 10)

WebUI.closeBrowser()
