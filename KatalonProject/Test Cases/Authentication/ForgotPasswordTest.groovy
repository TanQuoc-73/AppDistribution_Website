import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Forgot Password flow
 * Verifies that the forgot password form submits correctly
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

// Click forgot password link on login page
WebUI.click(findTestObject('LoginPage/lnk_forgotPassword'))
WebUI.waitForPageLoad(10)

// Verify forgot password page loaded
WebUI.verifyElementPresent(findTestObject('ForgotPasswordPage/txt_email'), 10)
WebUI.verifyElementPresent(findTestObject('ForgotPasswordPage/btn_sendResetEmail'), 10)

// Test 1: Submit with valid email
WebUI.setText(findTestObject('ForgotPasswordPage/txt_email'), GlobalVariable.validEmail)
WebUI.click(findTestObject('ForgotPasswordPage/btn_sendResetEmail'))
WebUI.delay(3)

// Verify success message appears
WebUI.verifyTextPresent('If the email exists', false)

// Test 2: Submit with empty email
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/forgot-password')
WebUI.waitForPageLoad(5)
WebUI.click(findTestObject('ForgotPasswordPage/btn_sendResetEmail'))
WebUI.delay(1)

// Verify user stays on the page (HTML5 validation blocks submission)
WebUI.verifyElementPresent(findTestObject('ForgotPasswordPage/btn_sendResetEmail'), 5)

WebUI.closeBrowser()
