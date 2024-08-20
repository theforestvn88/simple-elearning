require "test_helper"

class AssignmentTest < ActiveSupport::TestCase
  context 'associtations' do
    should belong_to(:assignable)
    should belong_to(:assignee)
  end

  setup do
    @partner = create(:partner)
    @instructor = create(:instructor, partner: @partner, rank: :administrator)
    @course = create(:course, instructor: @instructor, partner: @partner)
  end

  test 'assign instructor to course' do
    assignment = Assignment.create(assignable: @course, assignee: @instructor)
    assert_equal @course.assignments, [assignment]
    assert_equal @instructor.assignments, [assignment]
  end
end
