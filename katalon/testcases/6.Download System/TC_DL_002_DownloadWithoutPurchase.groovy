import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'

WebUI.openBrowser('')
try {
    // Navigate to a product page directly and try to download without owning it
    WebUI.navigateToUrl(baseUrl + '/store/product/sample-product')
    WebUI.waitForElementVisible(findTestObject('Page/Catalog/btn_download'), 10)
    WebUI.click(findTestObject('Page/Catalog/btn_download'))
    WebUI.waitForElementVisible(findTestObject('Page/Download/err_need_purchase'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/Download/err_need_purchase'), 10)
} finally {
    WebUI.closeBrowser()
}
