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
end
