package keywords

import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.checkpoint.Checkpoint
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

/**
 * Custom Keywords for AppDistribution Website Testing
 */
class CustomKeywords {

    /**
     * Login with given credentials
     * @param email - User email
     * @param password - User password (encrypted)
     */
    @Keyword
    def login(String email, String password) {
        WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
        WebUI.waitForPageLoad(10)
        WebUI.setText(findTestObject('LoginPage/txt_email'), email)
        WebUI.setEncryptedText(findTestObject('LoginPage/txt_password'), password)
        WebUI.click(findTestObject('LoginPage/btn_signIn'))
        WebUI.waitForPageLoad(10)
        WebUI.delay(2)
    }

    /**
     * Login with default valid credentials from GlobalVariable
     */
    @Keyword
    def loginWithDefaultCredentials() {
        login(GlobalVariable.validEmail, GlobalVariable.validPassword)
    }

    /**
     * Verify user is logged in by checking header elements
     * @return boolean - true if user is logged in
     */
    @Keyword
    def boolean isUserLoggedIn() {
        return WebUI.verifyElementPresent(findTestObject('Header/lnk_profile'), 5, FailureHandling.OPTIONAL)
    }

    /**
     * Logout the current user
     */
    @Keyword
    def logout() {
        boolean signOutPresent = WebUI.verifyElementPresent(findTestObject('Header/btn_signOut'), 3, FailureHandling.OPTIONAL)
        if (signOutPresent) {
            WebUI.click(findTestObject('Header/btn_signOut'))
            WebUI.delay(2)
        }
    }

    /**
     * Navigate to a specific page via URL path
     * @param path - Relative path (e.g., '/store', '/cart')
     */
    @Keyword
    def navigateTo(String path) {
        WebUI.navigateToUrl(GlobalVariable.baseUrl + path)
        WebUI.waitForPageLoad(10)
        WebUI.delay(1)
    }

    /**
     * Wait for an element to be visible and clickable
     * @param testObject - The test object to wait for
     * @param timeout - Timeout in seconds
     */
    @Keyword
    def waitForElement(TestObject testObject, int timeout) {
        WebUI.waitForElementVisible(testObject, timeout)
        WebUI.waitForElementClickable(testObject, timeout)
    }

    /**
     * Add the first available product to cart from the store page
     * @return boolean - true if product was added, false if no addable product found
     */
    @Keyword
    def boolean addFirstProductToCart() {
        navigateTo('/store')
        WebUI.delay(2)

        WebUI.click(findTestObject('StorePage/card_firstProduct'))
        WebUI.waitForPageLoad(10)
        WebUI.delay(2)

        boolean addToCartPresent = WebUI.verifyElementPresent(
            findTestObject('ProductPage/btn_addToCart'), 3, FailureHandling.OPTIONAL)

        if (addToCartPresent) {
            WebUI.click(findTestObject('ProductPage/btn_addToCart'))
            WebUI.delay(3)
            return true
        }
        return false
    }

    /**
     * Clear the shopping cart completely
     */
    @Keyword
    def clearCart() {
        navigateTo('/cart')
        WebUI.delay(2)

        boolean clearBtnPresent = WebUI.verifyElementPresent(
            findTestObject('CartPage/btn_clearCart'), 3, FailureHandling.OPTIONAL)
        if (clearBtnPresent) {
            WebUI.click(findTestObject('CartPage/btn_clearCart'))
            WebUI.delay(2)
        }
    }

    /**
     * Take a screenshot with a descriptive name
     * @param screenshotName - Name for the screenshot file
     */
    @Keyword
    def takeScreenshot(String screenshotName) {
        String timestamp = new Date().format('yyyyMMdd_HHmmss')
        String filePath = GlobalVariable.screenshotDir + '/' + screenshotName + '_' + timestamp + '.png'
        WebUI.takeScreenshot(filePath)
    }

    /**
     * Verify page title contains expected text
     * @param expectedTitle - Expected title text
     */
    @Keyword
    def verifyPageTitle(String expectedTitle) {
        String actualTitle = WebUI.getWindowTitle()
        assert actualTitle.contains(expectedTitle) : "Expected title containing '${expectedTitle}' but got '${actualTitle}'"
    }

    /**
     * Check if the current URL contains the expected path
     * @param expectedPath - Expected URL path
     * @return boolean
     */
    @Keyword
    def boolean isOnPage(String expectedPath) {
        String currentUrl = WebUI.getUrl()
        return currentUrl.contains(expectedPath)
    }

    /**
     * Proceed through checkout with specified payment method
     * @param paymentMethod - 'credit_card', 'bank_transfer', 'paypal', or 'ewallet'
     */
    @Keyword
    def proceedCheckout(String paymentMethod) {
        navigateTo('/cart')
        WebUI.delay(2)
        WebUI.click(findTestObject('CartPage/btn_checkout'))
        WebUI.waitForPageLoad(10)
        WebUI.delay(2)

        // Select payment method
        switch (paymentMethod) {
            case 'credit_card':
                WebUI.click(findTestObject('CheckoutPage/btn_creditCard'))
                break
            case 'bank_transfer':
                WebUI.click(findTestObject('CheckoutPage/btn_bankTransfer'))
                break
            case 'paypal':
                WebUI.click(findTestObject('CheckoutPage/btn_paypal'))
                break
            case 'ewallet':
                WebUI.click(findTestObject('CheckoutPage/btn_ewallet'))
                break
        }
        WebUI.delay(1)

        // Place order
        WebUI.click(findTestObject('CheckoutPage/btn_placeOrder'))
        WebUI.delay(5)
    }

    /**
     * Generate a unique string for test data (to avoid collisions)
     * @param prefix - Prefix for the generated string
     * @return String - Unique string
     */
    @Keyword
    def String generateUniqueString(String prefix) {
        String timestamp = new Date().format('yyyyMMddHHmmss')
        String random = UUID.randomUUID().toString().substring(0, 6)
        return prefix + '_' + timestamp + '_' + random
    }
}
