import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/store')
    WebUI.waitForElementVisible(findTestObject('Page/Catalog/software_list'), 10)
    WebUI.click(findTestObject('Page/Catalog/first_product'))
    WebUI.waitForElementVisible(findTestObject('Page/Catalog/product_title'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/Catalog/product_title'), 10)
} finally {
    WebUI.closeBrowser()
}
