require 'test_helper'

class CourseTest < ActiveSupport::TestCase
  context 'associations' do
    should belong_to(:instructor)
    should belong_to(:partner)
    should have_many(:milestones).dependent(:destroy)
    should have_many(:lessons).dependent(:destroy)
    should have_many(:activities)
    should have_many(:assignments)
    should have_one_attached(:cover)
  end

  context 'valications' do
    should validate_presence_of(:name).on(:create)
    should validate_presence_of(:summary).on(:create)
  end

  test 'has many assignees' do
    partner = create(:partner)
    admin = create(:instructor, partner: partner, rank: :administrator)
    instructor1 = create(:instructor, partner: partner, rank: :lecturer)
    instructor2 = create(:instructor, partner: partner, rank: :assistant_professor)
    course = create(:course, instructor: admin, partner: partner)
    create(:assignment, assignable: course, assignee: instructor1)
    create(:assignment, assignable: course, assignee: instructor2)

    assert_equal course.assignees, [instructor1, instructor2]
  end
end
