# frozen_string_literal: true

require 'test_helper'

class InstructorPolicyTest < ActiveSupport::TestCase
    setup do
        @partner = create(:partner)
        @admin = create(:instructor, partner: @partner, rank: :administrator)
        @other_admin = create(:instructor, partner: @partner, rank: :administrator)
        @instructor = create(:instructor, partner: @partner, rank: :professor)
        @other = create(:instructor, partner: @partner, rank: :professor)
        @user = create(:user)
    end
    
    test 'everyone could view instructor profile' do
        assert_permit_policy @user, @instructor, :show
        assert_permit_policy @other, @instructor, :show
        assert_permit_policy nil, @instructor, :show
    end

    test 'only admin could create lower-level instructor account' do
        assert_permit_policy @admin, @instructor, :create
        refute_permit_policy @admin, @admin, :create
        refute_permit_policy @instructor, @instructor, :create
        refute_permit_policy @other, @instructor, :create
        refute_permit_policy @user, @instructor, :create
    end

    test 'instructor could update his profile' do
        assert_permit_policy @instructor, @instructor, :update
        refute_permit_policy @other, @instructor, :update
        refute_permit_policy @user, @instructor, :update
    end

    test 'not allow to update rank unless you are admin' do
        @instructor.rank = :lecturer
        refute_permit_policy @instructor, @instructor, :update
        assert_permit_policy @admin, @instructor, :update
    end

    test 'admin could update lower-level instructors' do
        assert_permit_policy @admin, @instructor, :update
        refute_permit_policy @admin, @other_admin, :update
    end

    test 'nerver allow to update rank to :administrator' do
        @instructor.rank = :administrator
        refute_permit_policy @admin, @instructor, :update
    end

    test 'only admin could delete lower-leval instructor account' do
        assert_permit_policy @admin, @instructor, :destroy
        refute_permit_policy @admin, @admin, :destroy
        refute_permit_policy @instructor, @instructor, :destroy
        refute_permit_policy @other, @instructor, :destroy
        refute_permit_policy @user, @instructor, :destroy
    end
end
