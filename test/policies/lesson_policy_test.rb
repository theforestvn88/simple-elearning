require 'test_helper'

class LessonPolicyTest < ActiveSupport::TestCase
    setup do
        @partner = create(:partner)
        @admin = create(:instructor, partner: @partner, rank: :administrator)
        @professor = create(:instructor, partner: @partner, rank: :professor)
        @other_instructor = create(:instructor)
        @user = create(:user)
        @course = create(:course, instructor: @admin, partner: @partner)
        @milestone = create(:milestone, instructor: @professor, course: @course)
        @lesson = create(:lesson, instructor: @professor, course: @course, milestone: @milestone, estimated_minutes: 60)
    end

    test 'user not allowed to create lesson policy' do
        refute_permit_policy @user, :lesson, :create
    end

    test 'user not allowed to update lesson policy' do
        refute_permit_policy @user, @lesson, :update
    end

    test 'user not allowed to destroy lesson policy' do
        refute_permit_policy @user, @lesson, :destroy
    end

    test 'only assigned-instructor could create new lesson policy' do
        assert_permit_policy @admin, @lesson, :create
        assert_permit_policy @professor, @lesson, :create
        refute_permit_policy @other_instructor, @lesson, :create
    end

    test 'only assigned-instructor could update lesson policy' do
        assert_permit_policy @admin, @lesson, :update
        assert_permit_policy @professor, @lesson, :update
        refute_permit_policy @other_instructor, @lesson, :update
    end

    test 'only assigned-instructor could destroy lesson policy' do
        assert_permit_policy @admin, @lesson, :destroy
        assert_permit_policy @professor, @lesson, :destroy
        refute_permit_policy @other_instructor, @lesson, :destroy
    end
end
