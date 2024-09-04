# frozen_string_literal: true

require 'test_helper'

class InstructorPolicyTest < ActiveSupport::TestCase
    setup do
        @partner = create(:partner)
        @admin = create(:instructor, partner: @partner, rank: :administrator)
        @instructor = create(:instructor, partner: @partner, rank: :professor)
        @other = create(:instructor, partner: @partner, rank: :professor)
        @user = create(:user)
    end
    
    test 'everyone could view instructor profile' do
        assert_permit_policy @user, @instructor, :show
        assert_permit_policy @other, @instructor, :show
        assert_permit_policy nil, @instructor, :show
    end

    test 'only instructor could update his profile' do
        assert_permit_policy @instructor, @instructor, :update
        refute_permit_policy @other, @instructor, :update
        refute_permit_policy @user, @instructor, :update
    end

    test 'only admin could delete instructor account' do
        assert_permit_policy @admin, @instructor, :destroy
        refute_permit_policy @instructor, @instructor, :destroy
        refute_permit_policy @other, @instructor, :destroy
        refute_permit_policy @user, @instructor, :destroy
    end
end
