require 'test_helper'

class CoursePolicyTest < ActiveSupport::TestCase
    setup do
        @course = create(:course)
        @user = create(:user)
    end
    
    test 'everyone could view courses' do
        assert_permit_policy nil, @course, :show
    end

    test 'all signed-up users could create new courses' do
        assert_permit_policy @user, :course, :create
    end
end
