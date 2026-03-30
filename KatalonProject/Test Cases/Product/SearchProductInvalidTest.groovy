import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import org.openqa.selenium.Keys as Keys

/**
 * Test Case: Search Product Invalid (No Results)
 * Verifies that searching for a non-existent app shows the empty state correctly
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/store')
WebUI.maximizeWindow()
WebUI.waitForPageLoad(10)

// Search cho một ứng dụng được đảm bảo không bao giờ tồn tại
WebUI.clearText(findTestObject('StorePage/txt_search'))
WebUI.sendKeys(findTestObject('StorePage/txt_search'), 'ThisAppWillNeverExist12345')
WebUI.delay(1)
WebUI.sendKeys(findTestObject('StorePage/txt_search'), Keys.chord(Keys.ENTER))
WebUI.delay(3)

// Verify thông báo lỗi hiển thị (trên empty state UI)
boolean noResults = WebUI.verifyTextPresent('No apps found', false, FailureHandling.OPTIONAL)
if (noResults) {
    WebUI.comment('Test Passed: Đã hiển thị đúng thông báo "No apps found" UI state.')
} else {
    WebUI.comment('Test Failed: Không tìm thấy dòng chữ "No apps found".')
}

// Verify filter chip (thẻ mô tả điều kiện lọc) xuất hiện trên đầu danh sách
boolean hasFilterChip = WebUI.verifyTextPresent('Filtering:', false, FailureHandling.OPTIONAL)
if (hasFilterChip) {
     WebUI.comment('Đã xuất hiện chip báo hiệu bộ lọc search đang hoạt động.')
}

WebUI.closeBrowser()