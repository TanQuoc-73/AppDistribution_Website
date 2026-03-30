import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.model.FailureHandling as FailureHandling

/**
 * Test Case: Edit Review
 * Verifies that a user can edit an existing review they submitted for a marketplace app.
 */

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/login')
WebUI.maximizeWindow()

// Đăng nhập
WebUI.setText(findTestObject('LoginPage/txt_email'), GlobalVariable.validEmail)
WebUI.setText(findTestObject('LoginPage/txt_password'), GlobalVariable.validPassword)
WebUI.click(findTestObject('LoginPage/btn_signIn'))
WebUI.waitForPageLoad(10)

// Mở trang chi tiết ứng dụng đã mua và từng đánh giá
WebUI.navigateToUrl(GlobalVariable.baseUrl + '/product/gameA-slug')
WebUI.waitForPageLoad(10)

// Verify nút Edit (Chỉnh sửa) đánh giá xuất hiện ở phần bình luận của mình
WebUI.verifyElementPresent(findTestObject('ReviewPage/btn_editMyReview'), 5, FailureHandling.STOP_ON_FAILURE)
WebUI.click(findTestObject('ReviewPage/btn_editMyReview'))
WebUI.delay(1)

// Sửa nội dung
WebUI.clearText(findTestObject('ReviewPage/txt_reviewContent'))
WebUI.setText(findTestObject('ReviewPage/txt_reviewContent'), 'I changed my mind. This game is actually awesome!')

// Sửa số sao (Rating)
WebUI.click(findTestObject('ReviewPage/star_5'))

// Lưu đánh giá mới
WebUI.click(findTestObject('ReviewPage/btn_submitReview'))
WebUI.delay(3)

// Verify nội dung mới hiện lên màn hình ngay lập tức
WebUI.verifyTextPresent('I changed my mind. This game is actually awesome!', false, FailureHandling.STOP_ON_FAILURE)

WebUI.closeBrowser()
