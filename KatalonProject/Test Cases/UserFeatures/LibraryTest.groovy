import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Test Case: User Library
 * Verifies that the library page loads and shows owned products
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

// Navigate to library
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/library')
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Verify library page title
WebUI.verifyElementPresent(findTestObject('LibraryPage/txt_libraryTitle'), 10)

// Check if library has items or is empty
boolean hasDownloadBtn = WebUI.verifyElementPresent(findTestObject('LibraryPage/btn_download'), 3, com.kms.katalon.core.model.FailureHandling.OPTIONAL)

if (hasDownloadBtn) {
    WebUI.comment('Library has items - download button is present')
    // Verify download button functionality
    WebUI.verifyElementClickable(findTestObject('LibraryPage/btn_download'))
} else {
    WebUI.comment('Library is empty')
    WebUI.verifyTextPresent('empty', false)
}

// Test: Navigate to library from header
WebUI.navigateToUrl(GlobalVariable.baseUrl)
WebUI.waitForPageLoad(5)

boolean libraryLinkPresent = WebUI.verifyElementPresent(findTestObject('Header/lnk_library'), 3, com.kms.katalon.core.model.FailureHandling.OPTIONAL)
if (libraryLinkPresent) {
    WebUI.click(findTestObject('Header/lnk_library'))
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)
    WebUI.verifyElementPresent(findTestObject('LibraryPage/txt_libraryTitle'), 10)
}

WebUI.closeBrowser()
