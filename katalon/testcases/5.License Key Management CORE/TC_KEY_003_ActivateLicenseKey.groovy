import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

String baseUrl = GlobalVariable.BASE_URL ?: 'http://localhost:3000'

WebUI.openBrowser('')
try {
    WebUI.navigateToUrl(baseUrl + '/dashboard/license')
    WebUI.waitForElementVisible(findTestObject('Page/License/license_list'), 10)
    WebUI.click(findTestObject('Page/License/first_license_btn_activate'))
    WebUI.waitForElementVisible(findTestObject('Page/License/msg_activate_success'), 10)
    WebUI.verifyElementPresent(findTestObject('Page/License/msg_activate_success'), 10)
} finally {
    WebUI.closeBrowser()
}
