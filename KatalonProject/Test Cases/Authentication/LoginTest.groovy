import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
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
 * Test Case: Login with valid credentials
 * Verifies that a user can sign in successfully with correct email/password
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

// Verify login page loads correctly
WebUI.verifyElementPresent(findTestObject('LoginPage/txt_email'), 10)
WebUI.verifyElementPresent(findTestObject('LoginPage/txt_password'), 10)
WebUI.verifyElementPresent(findTestObject('LoginPage/btn_signIn'), 10)

// Enter valid credentials
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)

// Click Sign In
WebUI.click(findTestObject('LoginPage/btn_signIn'))

// Wait for redirect and verify successful login
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Verify user is redirected to home page or profile is visible in header
WebUI.verifyElementPresent(findTestObject('Header/lnk_profile'), 15)

// Verify Sign Out button is present (indicates logged in state)
WebUI.verifyElementPresent(findTestObject('Header/btn_signOut'), 10)

WebUI.closeBrowser()
