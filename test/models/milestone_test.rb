require 'test_helper'

class MilestoneTest < ActiveSupport::TestCase
  context 'associations' do
    should belong_to(:course)
    should belong_to(:instructor)
  end

  context 'validations' do
    should validate_presence_of(:name)
    should validate_numericality_of(:estimated_minutes)
            .only_integer
            .is_greater_than_or_equal_to(0)
            .allow_nil
  end
end
