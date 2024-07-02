require 'test_helper'

class UserPolicyTest < ActiveSupport::TestCase
    setup do
        @user = create(:user)
        @other = create(:user)
    end
    
    test 'everyone could view user profile' do
        assert_permit_policy nil, @user, :show
    end

    test 'only user could update his profile' do
        assert_permit_policy @user, @user, :update
        refute_permit_policy @other, @user, :update
    end

    test 'only user could delete his account' do
        assert_permit_policy @user, @user, :destroy
        refute_permit_policy @other, @user, :destroy
    end
end
