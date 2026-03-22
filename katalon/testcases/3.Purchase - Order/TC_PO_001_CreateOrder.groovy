import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/store')
    WebUI.waitForElementVisible(findTestObject('Page/Catalog/first_product'), 10)
    WebUI.click(findTestObject('Page/Catalog/first_product'))
    WebUI.waitForElementVisible(findTestObject('Page/Catalog/btn_buy'), 10)
    WebUI.click(findTestObject('Page/Catalog/btn_buy'))
    // Expect to land on checkout
    WebUI.waitForElementVisible(findTestObject('Page/Payment/h1_Checkout'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/Payment/h1_Checkout'), 10)
} finally {
    WebUI.closeBrowser()
}
