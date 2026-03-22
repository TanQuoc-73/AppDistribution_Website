import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/checkout')
    WebUI.waitForElementVisible(findTestObject('Page/Payment/btn_cancel_payment'), 10)
    WebUI.click(findTestObject('Page/Payment/btn_cancel_payment'))
    WebUI.waitForElementVisible(findTestObject('Page/Payment/msg_payment_cancelled'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/Payment/msg_payment_cancelled'), 10)
} finally {
    WebUI.closeBrowser()
}
