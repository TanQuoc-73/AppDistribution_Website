import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObject
import internal.GlobalVariable as GlobalVariable

/**
 * Katalon Studio test case: Login then open Library and verify access
 *
 * Requirements:
 * - Set Global Variables in Katalon Profile: BASE_URL, TEST_EMAIL, TEST_PASSWORD
 * - App running locally (e.g. http://localhost:3000)
 */

String baseUrl = (GlobalVariable.BASE_URL) ? GlobalVariable.BASE_URL : 'http://localhost:3000'
String email = (GlobalVariable.TEST_EMAIL) ? GlobalVariable.TEST_EMAIL : 'test@example.com'
String password = (GlobalVariable.TEST_PASSWORD) ? GlobalVariable.TEST_PASSWORD : 'password123'

try {
    WebUI.openBrowser('')
    WebUI.maximizeWindow()

    // Go to login page
    WebUI.navigateToUrl(baseUrl + '/auth/login')

    // Build dynamic TestObjects
    TestObject emailInput = new TestObject('emailInput')
    emailInput.addProperty('xpath', ConditionType.EQUALS, "//input[@type='email']")

    TestObject passwordInput = new TestObject('passwordInput')
    passwordInput.addProperty('xpath', ConditionType.EQUALS, "//input[@type='password']")

    TestObject signInButton = new TestObject('signInButton')
    signInButton.addProperty('xpath', ConditionType.EQUALS, "//button[normalize-space(.)='Sign In']")

    // Wait and fill
    WebUI.waitForElementPresent(emailInput, 10)
    WebUI.setText(emailInput, email)
    WebUI.setText(passwordInput, password)
    WebUI.click(signInButton)

    // Wait for possible redirect/settle
    WebUI.delay(2)

    // Navigate to library explicitly (covers case when login redirected elsewhere)
    WebUI.navigateToUrl(baseUrl + '/library')

    // Wait for library heading
    TestObject libraryHeading = new TestObject('libraryHeading')
    libraryHeading.addProperty('xpath', ConditionType.EQUALS, "//h1[contains(normalize-space(.), 'My Library')]" )

    boolean visible = WebUI.waitForElementPresent(libraryHeading, 10, FailureHandling.OPTIONAL)
    if (!visible) {
        WebUI.takeScreenshot()
        WebUI.comment('Library heading not found — possible redirect to login')
        WebUI.verifyMatch(WebUI.getUrl(), ".*/library.*", false)
    } else {
        WebUI.comment('Library accessible — test passed')
    }

} catch (Exception e) {
    WebUI.takeScreenshot()
    throw e
} finally {
    WebUI.closeBrowser()
}
