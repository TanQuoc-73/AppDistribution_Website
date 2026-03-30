import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling as FailureHandling
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
WebUI.setText(findTestObject('LoginPage/txt_email'), 'testuser1@gmail.com')

WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)

WebUI.click(findTestObject('LoginPage/btn_signIn'))

WebUI.delay(2)

// Verify error message appears
boolean hasError1 = WebUI.verifyElementPresent(findTestObject('LoginPage/txt_errorMessage'), 10, FailureHandling.OPTIONAL)
if (!hasError1) {
    WebUI.comment('LỖI KHÔNG TÌM THẤY ERROR MESSAGE TẠI TEST 1. URL: ' + WebUI.getUrl())
} else {
    WebUI.comment('Test 1 Passed: Đã thấy error message.')
}

// Clear fields
WebUI.clearText(findTestObject('LoginPage/txt_email'))

WebUI.clearText(findTestObject('LoginPage/txt_password'))

// Test 2: Wrong password
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.adminEmail)

WebUI.setText(findTestObject('LoginPage/txt_password'), 'WrongPassword123!')

WebUI.click(findTestObject('LoginPage/btn_signIn'))

WebUI.delay(2)

// Verify error message appears
boolean hasError2 = WebUI.verifyElementPresent(findTestObject('LoginPage/txt_errorMessage'), 10, FailureHandling.OPTIONAL)
if (!hasError2) {
    WebUI.comment('LỖI KHÔNG TÌM THẤY ERROR MESSAGE TẠI TEST 2. URL: ' + WebUI.getUrl())
} else {
    WebUI.comment('Test 2 Passed: Đã thấy error message.')
}

// Clear fields
WebUI.clearText(findTestObject('LoginPage/txt_email'))

WebUI.clearText(findTestObject('LoginPage/txt_password'))

// Test 3: Empty fields
WebUI.click(findTestObject('LoginPage/btn_signIn'))

WebUI.delay(1)

// Verify user stays on login page
WebUI.verifyElementPresent(findTestObject('LoginPage/btn_signIn'), 5)

// Test 4: Non-existent email
WebUI.setText(findTestObject('LoginPage/txt_email'), 'testuser@Gmail.com')

WebUI.setText(findTestObject('LoginPage/txt_password'), '12345678')

WebUI.click(findTestObject('LoginPage/btn_signIn'))

WebUI.delay(2)

boolean hasError4 = WebUI.verifyElementPresent(findTestObject('LoginPage/txt_errorMessage'), 10, FailureHandling.OPTIONAL)
if (!hasError4) {
    WebUI.comment('LỖI KHÔNG TÌM THẤY ERROR MESSAGE TẠI TEST 4. URL: ' + WebUI.getUrl())
} else {
    WebUI.comment('Test 4 Passed: Đã thấy error message.')
}

WebUI.closeBrowser()

