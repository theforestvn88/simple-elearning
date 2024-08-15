require 'test_helper'

class MilestonePolicyTest < ActiveSupport::TestCase
    setup do
        @partner = create(:partner)
        @admin = create(:instructor, partner: @partner, rank: :administrator)
        @professor = create(:instructor, partner: @partner, rank: :professor)
        @other_instructor = create(:instructor)
        @user = create(:user)
        @course = create(:course, instructor: @admin, partner: @partner)
        @milestone = create(:milestone, instructor: @professor, course: @course)
    end

    test 'user not allowed to create milestone policy' do
        refute_permit_policy @user, :milestone, :create
    end

    test 'user not allowed to update milestone policy' do
        refute_permit_policy @user, @milestone, :update
    end

    test 'user not allowed to destroy milestone policy' do
        refute_permit_policy @user, @milestone, :destroy
    end

    test 'only assigned-instructor could create new milestone policy' do
        assert_permit_policy @admin, @milestone, :create
        assert_permit_policy @professor, @milestone, :create
        refute_permit_policy @other_instructor, @milestone, :create
    end

    test 'only assigned-instructor could update milestone policy' do
        assert_permit_policy @admin, @milestone, :update
        assert_permit_policy @professor, @milestone, :update
        refute_permit_policy @other_instructor, @milestone, :update
    end

    test 'only assigned-instructor could destroy milestone policy' do
        assert_permit_policy @admin, @milestone, :destroy
        assert_permit_policy @professor, @milestone, :destroy
        refute_permit_policy @other_instructor, @milestone, :destroy
    end
end
