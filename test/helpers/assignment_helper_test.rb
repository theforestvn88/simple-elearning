# frozen_string_literal: true

require 'test_helper'

class AssignmentHelperTest < ActionView::TestCase
    setup do
        @partner = create(:partner)
        @admin = create(:instructor, partner: @partner, rank: :administrator)
        @professor = create(:instructor, partner: @partner, rank: :professor)
        @course = create(:course, instructor: @admin, partner: @partner)
        @milestone = create(:milestone, instructor: @professor, course: @course)
        @lesson = create(:lesson, instructor: @professor, course: @course, milestone: @milestone, estimated_minutes: 60)
    end

    test 'assignment course path' do
        assert_equal assignment_path(@course), "courses/#{@course.id}"
    end

    test 'assignment milestone path' do
        assert_equal assignment_path(@milestone), "courses/#{@course.id}/milestones/#{@milestone.id}"
    end

    test 'assignment lesson path' do
        assert_equal assignment_path(@lesson), "courses/#{@course.id}/milestones/#{@milestone.id}/lessons/#{@lesson.id}"
    end
end
