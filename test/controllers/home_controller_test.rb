require 'test_helper'

class HomeControllerTest < ActionDispatch::IntegrationTest
  test 'should get root app page' do
    get root_url
    assert_response :success
  end
end
