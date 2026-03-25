import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: Logout flow
 * Verifies that a logged-in user can sign out
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

// Login first
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setEncryptedText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Verify logged in state
WebUI.verifyElementPresent(findTestObject('Header/btn_signOut'), 10)

// Click Sign Out
WebUI.click(findTestObject('Header/btn_signOut'))
WebUI.delay(2)

// Verify user is logged out - Sign In link should be visible
WebUI.verifyElementPresent(findTestObject('Header/lnk_signIn'), 10)

// Verify Register button is visible
WebUI.verifyElementPresent(findTestObject('Header/btn_register'), 10)

// Verify accessing protected pages redirects to login
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/profile')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Should redirect to login page
WebUI.verifyElementPresent(findTestObject('LoginPage/btn_signIn'), 10)

WebUI.closeBrowser()
