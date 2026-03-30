import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Search By Tag
 * Verifies that the marketplace correctly filters apps when a Tag is clicked or searched.
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.maximizeWindow()
WebUI.waitForPageLoad(10)

// Bước 1: Verify danh sách Tag block hiển thị trên Store
WebUI.verifyElementPresent(findTestObject('StorePage/div_tagsContainer'), 10, FailureHandling.STOP_ON_FAILURE)

// Bước 2: Click vào một thẻ tag ví dụ "Multiplayer"
WebUI.click(findTestObject('StorePage/btn_tagMultiplayer'))
WebUI.waitForPageLoad(10)
WebUI.delay(2)

// Bước 3: Verify danh sách Grid thu hẹp lại và chỉ hiện game có tag Multiplayer
WebUI.verifyElementPresent(findTestObject('StorePage/div_productGrid'), 10)

// Bước 4: Verify chữ "Filtering by Tag: Multiplayer" hiển thị
WebUI.verifyTextPresent('Multiplayer', false, FailureHandling.STOP_ON_FAILURE)

WebUI.closeBrowser()
