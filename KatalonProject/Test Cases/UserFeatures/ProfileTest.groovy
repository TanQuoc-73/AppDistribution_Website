import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: User Profile Management
 * Verifies profile view and update functionality
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

// Navigate to profile page
WebUI.click(findTestObject('Header/lnk_profile'))
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Verify profile page elements
WebUI.verifyElementPresent(findTestObject('ProfilePage/txt_displayName'), 10)
WebUI.verifyElementPresent(findTestObject('ProfilePage/txt_bio'), 10)
WebUI.verifyElementPresent(findTestObject('ProfilePage/btn_saveChanges'), 10)
WebUI.verifyElementPresent(findTestObject('ProfilePage/txt_walletBalance'), 10)

// Test: Update display name
String timestamp = new Date().format('HHmmss')
String newDisplayName = 'TestUser_' + timestamp

WebUI.clearText(findTestObject('ProfilePage/txt_displayName'))
WebUI.setText(findTestObject('ProfilePage/txt_displayName'), newDisplayName)

// Test: Update bio
WebUI.clearText(findTestObject('ProfilePage/txt_bio'))
WebUI.setText(findTestObject('ProfilePage/txt_bio'), 'Automated test bio update at ' + timestamp)

// Save changes
WebUI.click(findTestObject('ProfilePage/btn_saveChanges'))
WebUI.delay(3)

// Verify success message
WebUI.verifyTextPresent('Changes saved', false)

// Verify wallet balance is displayed
WebUI.verifyElementPresent(findTestObject('ProfilePage/txt_walletBalance'), 10)

WebUI.closeBrowser()
