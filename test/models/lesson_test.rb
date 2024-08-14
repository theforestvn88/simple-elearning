require "test_helper"

class LessonTest < ActiveSupport::TestCase
  context 'associtations' do
    should belong_to(:instructor)
    should belong_to(:course)
    should belong_to(:milestone)
  end

  context 'validations' do
    should validate_presence_of(:name)
    should validate_numericality_of(:estimated_minutes)
            .only_integer
            .is_greater_than_or_equal_to(1)
  end
end
