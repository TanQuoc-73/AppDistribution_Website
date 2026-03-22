import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'
String cardNumber = GlobalVariable.TEST_CARD_NUMBER ?: '4242424242424242'
String cardExp = GlobalVariable.TEST_CARD_EXP ?: '12/30'
String cardCvc = GlobalVariable.TEST_CARD_CVC ?: '123'

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/checkout')
    WebUI.waitForElementVisible(findTestObject('Page/Payment/input_card_number'), 10)
    WebUI.setText(findTestObject('Page/Payment/input_card_number'), cardNumber)
    WebUI.setText(findTestObject('Page/Payment/input_card_exp'), cardExp)
    WebUI.setText(findTestObject('Page/Payment/input_card_cvc'), cardCvc)
    WebUI.click(findTestObject('Page/Payment/btn_pay'))
    WebUI.waitForElementVisible(findTestObject('Page/Payment/msg_payment_success'), 15)
    WebUI.verifyElementPresent(findTestObject('Page/Payment/msg_payment_success'), 10)
} finally {
    WebUI.closeBrowser()
}
